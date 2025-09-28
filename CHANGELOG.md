# Changelog

## [1.1.0] - 2024-08-16

### Added
- **Admin Dashboard**: A secure, password-protected dashboard for content moderation.
  - Approve/unapprove guestbook entries.
  - Delete guestbook entries.
  - View all entries with their current status (Pending/Approved).
- **Admin Authentication**: Simple, cookie-based authentication for the admin panel.
  - Secure login page at `/admin/login`.
  - Logout functionality.
- **Middleware Protection**: Rute `/admin` dilindungi oleh middleware untuk memastikan hanya pengguna yang sudah login yang bisa mengaksesnya.

### Changed
- **Guestbook Submission**: Guestbook entries are now marked as `is_approved = false` by default upon submission.
- **Guestbook Feed**: The public feed at `/feed` now only displays entries where `is_approved = true`.

### Fixed
- Resolved complex redirection and caching issues in the admin panel by adopting a client-side data fetching strategy post-authentication.
- Ensured a smooth, no-refresh experience on the admin dashboard after performing actions (approve, delete).
