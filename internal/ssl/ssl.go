package ssl

import (
	"fmt"
	"os/exec"
	"strings"
)

type CertInfo struct {
	Domain string `json:"domain"`
	Expiry string `json:"expiry"`
	Status string `json:"status"` // valid, expiring, expired
	Issuer string `json:"issuer"`
}

func IssueCertificate(domain, webroot, email string) error {
	cmd := exec.Command("certbot", "certonly", "--webroot", "-w", webroot, "-d", domain, "--non-interactive", "--agree-tos", "-m", email)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("certbot issue failed: %v, output: %s", err, string(out))
	}
	return nil
}

func RevokeCertificate(domain string) error {
	cmd := exec.Command("certbot", "revoke", "--cert-name", domain, "--non-interactive", "--delete-after-revoke")
	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("certbot revoke failed: %v, output: %s", err, string(out))
	}
	return nil
}

func ListCertificates() ([]CertInfo, error) {
	cmd := exec.Command("certbot", "certificates")
	out, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("failed to list certificates: %v", err)
	}

	lines := strings.Split(string(out), "\n")
	var certs []CertInfo
	var current CertInfo

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "Certificate Name:") {
			if current.Domain != "" {
				certs = append(certs, current)
			}
			current = CertInfo{}
			current.Domain = strings.TrimSpace(strings.TrimPrefix(line, "Certificate Name:"))
		} else if strings.HasPrefix(line, "Expiry Date:") {
			current.Expiry = strings.TrimSpace(strings.TrimPrefix(line, "Expiry Date:"))
			if strings.Contains(strings.ToLower(current.Expiry), "expired") {
				current.Status = "expired"
			} else {
				current.Status = "valid"
			}
		}
	}
	if current.Domain != "" {
		certs = append(certs, current)
	}

	return certs, nil
}

func CheckCertbotInstalled() bool {
	_, err := exec.LookPath("certbot")
	return err == nil
}
