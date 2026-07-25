# Contributing to Purnia Care

Thank you for your interest in contributing to **Purnia Care**! We welcome all bug reports, feature suggestions, UI enhancements, documentation improvements, and pull requests.

Please take a moment to review this document before submitting your contribution.

---

## Code of Conduct

Maintain a respectful, inclusive, and collaborative environment. Treat all team members and contributors with kindness and professional courtesy.

---

## Getting Started

1. **Fork & Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/new-project.git
   cd new-project
   ```

2. **Branching Strategy**:
   Create a descriptive branch for your work:
   - Features: `feature/doctor-telehealth-video`
   - Bugfixes: `bugfix/appointment-slot-overlap`
   - Documentation: `docs/api-architecture-update`
   - UI/UX Polish: `style/dashboard-responsive-grid`

   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Code Guidelines & Standards

### Backend (Django REST Framework)
- **Style Standard**: Follow [PEP 8](https://peps.python.org/pep-0008/) style guidelines.
- **Abstract Models**: Subclass `common.models.BaseModel` to ensure automatic `created_at`, `updated_at`, and soft delete capabilities.
- **API Formatting**: Ensure all responses return through standard DRF serializers or utilize `PurniaJSONRenderer` format:
  ```json
  {
    "success": true,
    "message": "Operation description",
    "data": { ... }
  }
  ```
- **Migrations**: Always run `python manage.py makemigrations` and ensure migrations apply without conflicts (`python manage.py migrate`).

### Frontend (React 19 + Vite + Tailwind CSS v4)
- **Components**: Write clean, modular functional components in `.jsx`.
- **Styling**: Use utility-first classes with Tailwind CSS v4. Avoid inline custom CSS styles unless required for dynamic calculations.
- **Linting & Code Quality**: Run `npm run lint` (using Oxlint) before committing code.
- **Services & Fallback**: When adding new API services to `src/services/apiService.js`, update `src/services/mockData.js` so the frontend remains fully functional in offline demo mode.

---

## Verification & Testing

Before submitting a Pull Request, run the following verification checks locally:

### 1. Backend Verification
```powershell
cd backend
python manage.py check
python manage.py test
```

### 2. Frontend Verification
```powershell
cd frontend
npm run lint
npm run build
```

---

## Submitting a Pull Request (PR)

1. **Commit Changes**: Make clear, concise commit messages following convention:
   ```bash
   git commit -m "feat(appointments): add online video consultation link to OPD appointments"
   ```
2. **Push to Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
3. **Open Pull Request**:
   - Provide a clear title and summary of changes.
   - Attach screenshots/GIFs for UI changes.
   - Reference any related issues (e.g., `Fixes #12`).

---

## Questions & Assistance

If you have questions or need assistance with setup, open an Issue on GitHub or reach out to the project maintainers. Happy coding!
