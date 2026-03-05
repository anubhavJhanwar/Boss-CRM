# Security Policy

## 🔒 Reporting a Vulnerability

If you discover a security vulnerability in Boss Tracker, please report it by emailing the project maintainer. Do not create a public GitHub issue.

## 🛡️ Security Best Practices

### For Developers

1. **Never commit sensitive data**:
   - `.env` files
   - `firebase-service-account.json`
   - API keys, passwords, or tokens
   - Database connection strings

2. **Always use environment variables** for:
   - Firebase configuration
   - Email credentials
   - API keys
   - Database URIs

3. **Keep dependencies updated**:
   ```bash
   npm audit
   npm audit fix
   ```

4. **Use strong passwords**:
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols

5. **Enable 2FA** on all accounts:
   - GitHub
   - Firebase
   - Gmail
   - Hosting platforms

### For Users

1. **Protect your credentials**:
   - Never share your password
   - Use unique passwords for each service
   - Enable 2FA on your account

2. **Keep the app updated**:
   - Install updates promptly
   - Check for security patches

3. **Report suspicious activity**:
   - Unusual login attempts
   - Unexpected emails
   - Data inconsistencies

## 🔐 Security Features

### Authentication
- Firebase Authentication with email/password
- Bcrypt password hashing
- JWT token-based sessions
- Automatic token refresh
- Secure token storage

### Data Protection
- User-specific data isolation
- Firestore security rules
- HTTPS encryption (production)
- Input validation
- SQL injection prevention (NoSQL)

### Email Security
- Gmail App Passwords (not account password)
- SMTP over TLS
- No password storage in emails
- Rate limiting on email sends

## 📋 Security Checklist

Before deploying to production:

- [ ] All `.env` files are in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] Firebase service account is secure
- [ ] Firestore security rules are set
- [ ] HTTPS is enabled
- [ ] CORS is configured properly
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies are up to date
- [ ] 2FA is enabled on all accounts

## 🚨 Known Security Considerations

### Firebase API Keys
Firebase API keys in the mobile app are **safe to expose** in client-side code. They are not secret and are meant to identify your Firebase project. Security is enforced by:
- Firestore security rules
- Firebase Authentication
- API restrictions in Firebase Console

### Gmail App Passwords
- Use App Passwords, not your actual Gmail password
- Rotate passwords regularly
- Revoke unused App Passwords

### Service Account Keys
- **NEVER** commit `firebase-service-account.json` to Git
- Store securely on server
- Rotate keys periodically
- Use environment variables when possible

## 🔄 Security Updates

This project follows security best practices and will be updated as needed to address vulnerabilities.

Last security review: 2026-03-05

## 📞 Contact

For security concerns, contact the project maintainer directly.
