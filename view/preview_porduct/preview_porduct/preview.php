<?php
// Use the customer/supplier presentation directly so future preview fixes stay in sync.
$promoflowRoot = dirname(__DIR__, 3);
$configuredRoot = trim((string)getenv('DOT63_APP_ROOT'));
$candidates = $configuredRoot !== '' ? [$configuredRoot] : [
    $promoflowRoot . '/dot63',
    dirname($promoflowRoot) . '/Dot63_v1',
];
$dot63Root = null;
foreach ($candidates as $candidate) {
    if (is_file($candidate . '/view/preview_porduct/preview_porduct/preview.php')) {
        $dot63Root = $candidate;
        break;
    }
}
if ($dot63Root === null) {
    http_response_code(503);
    echo '<main role="alert"><h1>Preview unavailable</h1><p>The shared product preview could not be found. Check the Dot63 installation path.</p></main>';
    return;
}
$appBase = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? '/view/preview_porduct/index.php', 3), '/.');
$defaultAssetBase = basename($dot63Root) === 'Dot63_v1'
    ? rtrim(dirname($appBase), '/.') . '/Dot63_v1'
    : $appBase . '/dot63';
$previewAssetBase = rtrim((string)(getenv('DOT63_ASSET_BASE') ?: $defaultAssetBase), '/');
$previewMode = 'review';
$previewEntryPath = '../../view/preview_porduct/preview_porduct/preview_logic.js';
$previewEntryVersion = filemtime(__DIR__ . '/preview_logic.js');
require $dot63Root . '/view/preview_porduct/preview_porduct/preview.php';
