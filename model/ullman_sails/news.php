<?php

class UllmanSailsNews
{
    private $db;

    public function __construct(DatabaseUllmanSails $connection)
    {
        $databaseConnection = $connection->getConnection();

        if (!$databaseConnection instanceof PDO) {
            throw new RuntimeException('The database connection is unavailable.');
        }

        $this->db = $databaseConnection;
    }

    /**
     * Returns the complete, ordered block tree for News pages.
     *
     * Public requests receive only published pages. Authenticated dashboard
     * requests can include drafts so editors see the complete library.
     */
    public function getNews($includeUnpublished = false)
    {
        $statusCondition = $includeUnpublished
            ? ''
            : " AND LOWER(p.status) = 'published'";

        $statement = $this->db->query("
            SELECT
                p.id AS page_id,
                p.category,
                p.title,
                p.status,
                p.published_at,
                p.created_at AS page_created_at,
                p.updated_at AS page_updated_at,
                s.id AS section_id,
                s.order_index AS section_order,
                b.id AS block_id,
                b.block_type,
                b.tag,
                b.content,
                b.order_index AS block_order
            FROM `pages` p
            LEFT JOIN `sections` s ON s.page_id = p.id
            LEFT JOIN `blocks` b ON b.section_id = s.id
            WHERE LOWER(p.category) = 'news'
              {$statusCondition}
            ORDER BY p.id ASC, s.order_index ASC, s.id ASC, b.order_index ASC, b.id ASC
        ");

        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
        $pages = array();

        foreach ($rows as $row) {
            $pageId = (int) $row['page_id'];

            if (!isset($pages[$pageId])) {
                $pages[$pageId] = array(
                    'id' => $pageId,
                    'category' => (string) $row['category'],
                    'title' => (string) $row['title'],
                    'status' => (string) $row['status'],
                    'published_at' => isset($row['published_at'])
                        ? (string) $row['published_at']
                        : null,
                    'created_at' => isset($row['page_created_at'])
                        ? (string) $row['page_created_at']
                        : null,
                    'updated_at' => isset($row['page_updated_at'])
                        ? (string) $row['page_updated_at']
                        : null,
                    'source_order' => PHP_INT_MAX,
                    'sections' => array(),
                    '_section_indexes' => array()
                );
            }

            if ($row['section_id'] === null) {
                continue;
            }

            $sectionId = (int) $row['section_id'];

            if (!isset($pages[$pageId]['_section_indexes'][$sectionId])) {
                $pages[$pageId]['_section_indexes'][$sectionId] = count($pages[$pageId]['sections']);
                $pages[$pageId]['sections'][] = array(
                    'id' => $sectionId,
                    'order_index' => (int) $row['section_order'],
                    'blocks' => array()
                );
            }

            if ($row['block_id'] === null) {
                continue;
            }

            $sectionIndex = $pages[$pageId]['_section_indexes'][$sectionId];
            $block = array(
                'id' => (int) $row['block_id'],
                'block_type' => (string) $row['block_type'],
                'tag' => isset($row['tag']) ? (string) $row['tag'] : null,
                'content' => isset($row['content']) ? (string) $row['content'] : '',
                'order_index' => (int) $row['block_order']
            );

            $pages[$pageId]['sections'][$sectionIndex]['blocks'][] = $block;

            if ($block['tag'] === 'source_order' && ctype_digit(trim($block['content']))) {
                $pages[$pageId]['source_order'] = (int) trim($block['content']);
            }
        }

        $news = array_values($pages);

        usort($news, function ($left, $right) {
            if ($left['source_order'] !== $right['source_order']) {
                return $left['source_order'] < $right['source_order'] ? -1 : 1;
            }

            $leftDate = $left['published_at'] ?: '';
            $rightDate = $right['published_at'] ?: '';

            if ($leftDate !== $rightDate) {
                return strcmp($rightDate, $leftDate);
            }

            return $right['id'] <=> $left['id'];
        });

        foreach ($news as &$page) {
            unset($page['_section_indexes']);

            if ($page['source_order'] === PHP_INT_MAX) {
                $page['source_order'] = null;
            }
        }
        unset($page);

        return $news;
    }

    public function getPublishedNews()
    {
        return $this->getNews(false);
    }

    public function saveNews(array $article, $requesterEmail, $isNew)
    {
        $userId = $this->requireAdministrator($requesterEmail);
        $title = trim((string) ($article['title'] ?? ''));
        $category = trim((string) ($article['category'] ?? 'News'));
        $status = strtolower((string) ($article['status'] ?? 'draft'));
        if ($title === '' || mb_strlen($title) > 255 || $category === '' || mb_strlen($category) > 100
            || !in_array($status, array('draft', 'published'), true)) {
            throw new InvalidArgumentException('Enter a title, category and a valid publication status.');
        }
        $date = (string) ($article['date'] ?? '');
        if ($date !== '') {
            $parsed = DateTime::createFromFormat('!Y-m-d', $date);
            if (!$parsed || $parsed->format('Y-m-d') !== $date) {
                throw new InvalidArgumentException('Enter a valid publication date.');
            }
        }
        $publishedAt = $date !== '' ? $date . ' 00:00:00' : ($status === 'published' ? date('Y-m-d H:i:s') : null);
        $sections = $this->validateSections($article['sections'] ?? null);
        $pageId = $isNew ? null : $this->validId($article['id'] ?? null);

        $this->db->beginTransaction();
        try {
            if ($isNew) {
                $statement = $this->db->prepare('INSERT INTO `pages` (category, title, status, published_at) VALUES (?, ?, ?, ?)');
                $statement->execute(array('News', $title, $status, $publishedAt));
                $pageId = (int) $this->db->lastInsertId();
                $sourceOrder = '0';
            } else {
                $this->lockNews($pageId);
                $statement = $this->db->prepare("SELECT b.content FROM blocks b JOIN sections s ON s.id = b.section_id WHERE s.page_id = ? AND b.tag = 'source_order' ORDER BY b.id LIMIT 1");
                $statement->execute(array($pageId));
                $sourceOrder = $statement->fetchColumn();
                $statement = $this->db->prepare('UPDATE `pages` SET title = ?, status = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
                $statement->execute(array($title, $status, $publishedAt, $pageId));
                // The existing foreign keys remove the old blocks with their sections.
                $statement = $this->db->prepare('DELETE FROM `sections` WHERE page_id = ?');
                $statement->execute(array($pageId));
            }

            $sections[0]['blocks'][] = array('block_type' => 'meta', 'tag' => 'news_tag', 'content' => $category);
            if ($sourceOrder !== false) {
                $sections[0]['blocks'][] = array('block_type' => 'meta', 'tag' => 'source_order', 'content' => (string) $sourceOrder);
            }
            $insertSection = $this->db->prepare('INSERT INTO `sections` (page_id, order_index) VALUES (?, ?)');
            $insertBlock = $this->db->prepare('INSERT INTO `blocks` (section_id, block_type, tag, content, order_index) VALUES (?, ?, ?, ?, ?)');
            foreach ($sections as $sectionIndex => $section) {
                $insertSection->execute(array($pageId, $sectionIndex + 1));
                $sectionId = (int) $this->db->lastInsertId();
                foreach ($section['blocks'] as $blockIndex => $block) {
                    $insertBlock->execute(array($sectionId, $block['block_type'], $block['tag'], $block['content'], $blockIndex + 1));
                }
            }
            $activity = $this->db->prepare('INSERT INTO `page_activity` (user_id, page_id, action) VALUES (?, ?, ?)');
            $activity->execute(array($userId, $pageId, $isNew ? 'create' : 'update'));
            $this->db->commit();
        } catch (Throwable $error) {
            if ($this->db->inTransaction()) $this->db->rollBack();
            throw $error;
        }
        foreach ($this->getNews(true) as $saved) {
            if ($saved['id'] === $pageId) return $saved;
        }
        throw new RuntimeException('The saved story could not be read.');
    }

    public function deleteNews($id, $requesterEmail)
    {
        $this->requireAdministrator($requesterEmail);
        $pageId = $this->validId($id);
        $this->db->beginTransaction();
        try {
            $this->lockNews($pageId);
            $statement = $this->db->prepare('DELETE FROM `pages` WHERE id = ?');
            $statement->execute(array($pageId));
            $this->db->commit();
        } catch (Throwable $error) {
            if ($this->db->inTransaction()) $this->db->rollBack();
            throw $error;
        }
    }

    private function requireAdministrator($email)
    {
        $statement = $this->db->prepare("SELECT id FROM users WHERE email = ? AND LOWER(role) = 'admin' AND LOWER(status) = 'active' LIMIT 1");
        $statement->execute(array((string) $email));
        $id = $statement->fetchColumn();
        if (!$id) throw new RuntimeException('An active administrator is required.', 403);
        return (int) $id;
    }

    private function validId($value)
    {
        $id = filter_var($value, FILTER_VALIDATE_INT);
        if (!$id || $id < 1) throw new InvalidArgumentException('Invalid story ID.');
        return (int) $id;
    }

    private function lockNews($id)
    {
        $statement = $this->db->prepare("SELECT id FROM pages WHERE id = ? AND LOWER(category) = 'news' FOR UPDATE");
        $statement->execute(array($id));
        if (!$statement->fetchColumn()) throw new RuntimeException('This story is no longer available.', 404);
    }

    private function validateSections($sections)
    {
        if (!is_array($sections) || count($sections) > 50) throw new InvalidArgumentException('Invalid story sections.');
        $result = array();
        $count = 0;
        $bytes = 0;
        foreach ($sections as $section) {
            if (!is_array($section) || !isset($section['blocks']) || !is_array($section['blocks'])) {
                throw new InvalidArgumentException('Invalid story content.');
            }
            $blocks = array();
            foreach ($section['blocks'] as $block) {
                if (!is_array($block) || ++$count > 500) throw new InvalidArgumentException('Too many content blocks.');
                $type = (string) ($block['block_type'] ?? '');
                $tag = (string) ($block['tag'] ?? '');
                $content = $block['content'] ?? '';
                if (in_array($tag, array('source_order', 'news_tag'), true)) continue;
                if (!in_array($type, array('paragraph', 'heading', 'image', 'quote', 'list', 'link', 'meta'), true)
                    || mb_strlen($tag) > 50 || !is_string($content) || strlen($content) > 60000) {
                    throw new InvalidArgumentException('Invalid content block.');
                }
                $bytes += strlen($content);
                if ($bytes > 1048576) throw new InvalidArgumentException('The story is too large.');
                $blocks[] = array('block_type' => $type, 'tag' => $tag, 'content' => $content);
            }
            $result[] = array('blocks' => $blocks);
        }
        return $result ?: array(array('blocks' => array()));
    }
}
