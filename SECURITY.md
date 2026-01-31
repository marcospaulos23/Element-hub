# Guia de Segurança - ElementHub

## Camadas de Segurança Implementadas

### 1. Headers de Segurança (Client-Side)

Os seguintes headers são configurados via meta tags no `index.html`:

- **Content-Security-Policy (CSP)**: Política rigorosa para prevenir XSS
- **X-Content-Type-Options**: nosniff - Previne MIME type sniffing
- **X-Frame-Options**: DENY - Previne clickjacking
- **X-XSS-Protection**: Ativa proteção XSS do navegador
- **Referrer-Policy**: Controla informações de referrer
- **Permissions-Policy**: Restringe recursos do navegador

### 2. Edge Function de Segurança

A função `security-headers` fornece headers de segurança adicionais para APIs.

### 3. Sanitização de Inputs

O módulo `src/lib/security/inputSanitizer.ts` fornece:

- Detecção de SQL Injection
- Detecção de XSS
- Detecção de Path Traversal
- Sanitização de HTML
- Validação de URLs
- Schemas Zod seguros

### 4. Proteções Client-Side

O hook `useSecurityHeaders` implementa:

- Detecção de iframe (anti-clickjacking)
- Proteção contra drag & drop malicioso
- Desabilitação de autocomplete em campos sensíveis

---

## Configurações Necessárias no Cloudflare

### Headers de Segurança (Page Rules ou Transform Rules)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### SSL/TLS

1. Acesse **SSL/TLS** > **Overview**
2. Selecione **Full (strict)** mode
3. Em **Edge Certificates**:
   - Ative "Always Use HTTPS"
   - Ative "Automatic HTTPS Rewrites"
   - Configure "Minimum TLS Version" para **TLS 1.2**

### HSTS

1. Acesse **SSL/TLS** > **Edge Certificates**
2. Ative **HTTP Strict Transport Security (HSTS)**
3. Configure:
   - Max Age: 12 months
   - Include Subdomains: Yes
   - Preload: Yes

### Proteção de Origem

1. Acesse **Security** > **WAF**
2. Crie regra para bloquear acesso direto ao IP:
   ```
   (not cf.client.ip in {173.245.48.0/20 103.21.244.0/22 103.22.200.0/22 ...})
   ```

### Firewall Rules

1. **Bloquear Bad Bots**:
   - Ative Bot Fight Mode em **Security** > **Bots**

2. **Rate Limiting**:
   - Configure em **Security** > **WAF** > **Rate Limiting Rules**

3. **IP Whitelisting para Admin**:
   ```
   (http.request.uri.path contains "/admin" and not ip.src in {SEU_IP})
   ```

---

## Configurações no Servidor de Origem

### Nginx (se aplicável)

```nginx
# Ocultar versão do servidor
server_tokens off;

# Headers de segurança
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;

# Aceitar apenas IPs do Cloudflare
# https://www.cloudflare.com/ips-v4
allow 173.245.48.0/20;
allow 103.21.244.0/22;
# ... adicionar todos os ranges
deny all;

# Forçar HTTPS
if ($scheme != "https") {
    return 301 https://$server_name$request_uri;
}

# Desabilitar métodos HTTP desnecessários
if ($request_method !~ ^(GET|HEAD|POST|PUT|DELETE|OPTIONS)$ ) {
    return 405;
}
```

### Portas e Serviços

Certifique-se de que apenas as portas 80 e 443 estão abertas publicamente:

```bash
# Verificar portas abertas
netstat -tlnp

# Fechar portas com iptables
iptables -A INPUT -p tcp --dport 22 -s SEU_IP -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j DROP
iptables -A INPUT -p tcp --dport 2082 -j DROP
iptables -A INPUT -p tcp --dport 2083 -j DROP
```

---

## Uso das Funções de Segurança no Código

### Validação de Input

```typescript
import { validateInput, secureSchemas } from '@/lib/security';

// Validação completa
const result = validateInput(userInput);
if (!result.isValid) {
  console.error('Ameaças detectadas:', result.threats);
  return;
}

// Usar input sanitizado
const safeInput = result.sanitized;

// Com Zod schemas
const emailResult = secureSchemas.safeEmail.safeParse(email);
if (!emailResult.success) {
  // Handle error
}
```

### Sanitização de URLs

```typescript
import { sanitizeUrl } from '@/lib/security';

const safeUrl = sanitizeUrl(userProvidedUrl);
if (!safeUrl) {
  throw new Error('URL inválida');
}
```

---

## Checklist de Segurança

- [ ] Headers de segurança configurados no Cloudflare
- [ ] SSL/TLS configurado como Full (strict)
- [ ] HSTS ativado com preload
- [ ] Rate limiting configurado
- [ ] Bot protection ativada
- [ ] Firewall rules para admin
- [ ] Servidor aceita apenas IPs do Cloudflare
- [ ] Portas administrativas bloqueadas
- [ ] Inputs validados em todos os formulários
- [ ] Logs de segurança monitorados
