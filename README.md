<h1 align="center">Next.js API utilities △</h1>
<h2 align="center">
  Next.js API utility library
</h2>
<p align="center">
  <a href="https://npmjs.org/package/@alessiofrittoli/next-api">
    <img src="https://img.shields.io/npm/v/@alessiofrittoli/next-api" alt="Latest version"/>
  </a>
  <a href="https://coveralls.io/github/alessiofrittoli/next-api">
    <img src="https://coveralls.io/repos/github/alessiofrittoli/next-api/badge.svg" alt="Test coverage"/>
  </a>
  <a href="https://socket.dev/npm/package/@alessiofrittoli/next-api/overview">
    <img src="https://socket.dev/api/badge/npm/package/@alessiofrittoli/next-api" alt="Socket Security score"/>
  </a>
  <a href="https://npmjs.org/package/@alessiofrittoli/next-api">
    <img src="https://img.shields.io/npm/dm/@alessiofrittoli/next-api.svg" alt="npm downloads"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/next-api">
    <img src="https://badgen.net/bundlephobia/dependency-count/@alessiofrittoli/next-api" alt="Dependencies"/>
  </a>
  <a href="https://libraries.io/npm/%40alessiofrittoli%2Fnext-api">
    <img src="https://img.shields.io/librariesio/release/npm/@alessiofrittoli/next-api" alt="Dependencies status"/>
  </a>
</p>
<p align="center">
  <a href="https://bundlephobia.com/package/@alessiofrittoli/next-api">
    <img src="https://badgen.net/bundlephobia/min/@alessiofrittoli/next-api" alt="minified"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/next-api">
    <img src="https://badgen.net/bundlephobia/minzip/@alessiofrittoli/next-api" alt="minizipped"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/next-api">
    <img src="https://badgen.net/bundlephobia/tree-shaking/@alessiofrittoli/next-api" alt="Tree shakable"/>
  </a>
</p>
<p align="center">
  <a href="https://github.com/sponsors/alessiofrittoli">
    <img src="https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2" alt="Fund this package"/>
  </a>
</p>

[sponsor-badge]: https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2
[sponsor-url]: https://github.com/sponsors/alessiofrittoli

### Table of Content

- [Development](#development)
  - [Local development](#local-development)
  - [Production build](#production-build)
  - [Unit tests](#unit-tests)
    - [Run tests with coverage](#run-tests-with-coverage)
  - [Contributing](#contributing)
  - [Security](#security)
- [API Reference](#api-reference)
- [Credits](#made-with-)

---

### Getting started

Run the following command to start using `next-api` in your projects:

```bash
npm i @alessiofrittoli/next-api
```

or using `pnpm`

```bash
pnpm i @alessiofrittoli/next-api
```

---

### Development

Run the following to start development

```shell
nvm use

pnpm i
```

#### Local development

Run the following

```shell
pnpm dev
```

This will generate unminified output code, sourcemaps and will enable source file watcher.

---

#### Production build

Run the following to create a local production build

```shell
pnpm build
```

This will generate minified output code without sourcemaps.

---

#### Unit tests

Run all the defined test suites by running the following:

```shell
# Run tests and watch file changes.
pnpm test:watch

# Run tests in a CI environment.
pnpm test:ci
```

---

##### Run tests with coverage

An HTTP server is then started to serve coverage files from `./coverage` folder.

⚠️ You may see a blank page the first time you run this command. Simply refresh the browser to see the updates.

```shell
pnpm test:coverage:serve
```

---

#### Contributing

Contributions are truly welcome!

Please refer to the [Contributing Doc](./CONTRIBUTING.md) for more information on how to start contributing to this project.

Help keep this project up to date with [GitHub Sponsor][sponsor-url].

[![GitHub Sponsor][sponsor-badge]][sponsor-url]

---

#### Security

If you believe you have found a security vulnerability, we encourage you to **_responsibly disclose this and NOT open a public issue_**. We will investigate all legitimate reports. Email `security@alessiofrittoli.it` to disclose any security vulnerabilities.

---

### API Reference

-- Docs coming soon --

---

### Made with ☕

<table style='display:flex;gap:20px;'>
  <tbody>
    <tr>
      <td>
        <img alt="avatar" src='https://avatars.githubusercontent.com/u/35973186' style='width:60px;border-radius:50%;object-fit:contain;'>
      </td>
      <td>
        <table style='display:flex;gap:2px;flex-direction:column;'>
          <tbody>
              <tr>
                <td>
                  <a href='https://github.com/alessiofrittoli' target='_blank' rel='noopener'>Alessio Frittoli</a>
                </td>
              </tr>
              <tr>
                <td>
                  <small>
                    <a href='https://alessiofrittoli.it' target='_blank' rel='noopener'>https://alessiofrittoli.it</a> |
                    <a href='mailto:info@alessiofrittoli.it' target='_blank' rel='noopener'>info@alessiofrittoli.it</a>
                  </small>
                </td>
              </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
