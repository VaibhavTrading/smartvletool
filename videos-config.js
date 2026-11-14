/**
 * ============================================================================
 * SMART VLE TOOL – Tutorial Videos Configuration
 * ============================================================================
 * How to update or replace any tutorial video:
 *   1. Simply replace the .mp4 file inside the `public/videos/` folder using
 *      the exact same filename:
 *        - public/videos/document-scanner.mp4
 *        - public/videos/id-card-scanner.mp4
 *        - public/videos/image-editing-tools.mp4
 *   2. Or update the `src`, `poster`, `title`, or `description` fields below.
 *   3. If a video is not yet uploaded, set `src: ''` (or remove the file) and
 *      the card will automatically show a clean "Tutorial video coming soon"
 *      placeholder instead of a broken player.
 * ============================================================================
 */
window.SMARTVLE_TUTORIAL_VIDEOS = [
  {
    id: 'document-scanner',
    badge: 'Document Studio',
    theme: 'doc',
    title: 'Document Scanner Tutorial',
    description: 'Learn how to scan, enhance and prepare documents for clear digital copies and printing.',
    placeholderTitle: 'Document Scanner Tutorial Video',
    src: '/videos/document-scanner.mp4',
    poster: '/videos/document-scanner-poster.jpg',
    toolUrl: '/document-studio',
    toolLabel: 'Open Document Studio ➔'
  },
  {
    id: 'id-card-scanner',
    badge: 'ID Card Studio',
    theme: 'id',
    title: 'ID Card Scanner Tutorial',
    description: 'Learn how to upload, edit and prepare ID cards for accurate printing.',
    placeholderTitle: 'ID Card Scanner Tutorial Video',
    src: '/videos/id-card-scanner.mp4',
    poster: '/videos/id-card-scanner-poster.jpg',
    toolUrl: '/id-card-studio',
    toolLabel: 'Open ID Card Studio ➔'
  },
  {
    id: 'image-editing-tools',
    badge: 'Image & PDF Editor',
    theme: 'editor',
    title: 'Image Editing Tools Tutorial',
    description: 'Learn how to resize, compress, convert and edit images using our online tools.',
    placeholderTitle: 'Image Editing Tools Tutorial Video',
    src: '/videos/image-editing-tools.mp4',
    poster: '/videos/image-editing-tools-poster.jpg',
    toolUrl: '/image-pdf-editor',
    toolLabel: 'Open Image & PDF Editor ➔'
  }
];
