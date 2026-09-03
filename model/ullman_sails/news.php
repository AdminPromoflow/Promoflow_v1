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
     * Returns the complete, ordered block tree for every published News page.
     */
    public function getPublishedNews()
    {
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
              AND LOWER(p.status) = 'published'
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
}
