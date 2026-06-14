# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- insertion marker -->

## [1.2.0](https://github.com/Astro-BEAM-AUTh/portal/compare/v1.1.0...v1.2.0) (2026-05-31)

### Features

* add a default preferred email for logged in users ([5a6da2c](https://github.com/Astro-BEAM-AUTh/portal/commit/5a6da2c37ee3a8d5bcb40e67b2879c551408cf19))
* add a script to autogenerate the OpenAPI types from the backend ([1cc4307](https://github.com/Astro-BEAM-AUTh/portal/commit/1cc43078a531eebe084f9de255ef70cb5198f1ce))
* add metadata in the observation form fields to reduce duplication, make observation type follow the backend enum values and add a script to fetch and create the Enumerator values from the backend through the OpenAPI doc ([2d94368](https://github.com/Astro-BEAM-AUTh/portal/commit/2d9436806b8241ad3c1cec1222c71b2e0dcd0c5e))
* make observation history visible for guest users using an env var feature flag and update the observations endpoint to use the new endpoint ([98dc41d](https://github.com/Astro-BEAM-AUTh/portal/commit/98dc41df39a538b7102bcf7ee09439e4a37d9f67))
* remove privileged user functionality ([4e6fc46](https://github.com/Astro-BEAM-AUTh/portal/commit/4e6fc46ed0779a788b231e6897fbd5066132b3fd))
* removed update status logic to instead poll for history updates and updated backend models to use capitalized versions of enums ([02483fe](https://github.com/Astro-BEAM-AUTh/portal/commit/02483fef4201d8a2e0a16ac04e02e1607682e620))
* sync DTOs with the ones created by the openAPI doc of the backend and make the supabase variables be drawn from env vars so that they can be configurable without code changes ([487c6a8](https://github.com/Astro-BEAM-AUTh/portal/commit/487c6a8d213f9fcbe71d4b72896c7549e07f2400))
* update models to match the backend ones ([859b6b7](https://github.com/Astro-BEAM-AUTh/portal/commit/859b6b7739332a242e1a7b49de2537ac679908e2))

### Bug Fixes

* add copilot review suggestions ([23270c8](https://github.com/Astro-BEAM-AUTh/portal/commit/23270c81999e5a83a018592a8597825db4b917c9))
* copilot suggestions of PR review ([d98d5ec](https://github.com/Astro-BEAM-AUTh/portal/commit/d98d5ecf52bd359ba5d1f28e8581d9d7166785e5))
* correct the reloading logic and the duplicate requests to backend ([16fe1ea](https://github.com/Astro-BEAM-AUTh/portal/commit/16fe1ea28a60bdb6b70f232bcaf4c45120d48855))
* various copilot suggestions ([46d44f8](https://github.com/Astro-BEAM-AUTh/portal/commit/46d44f8abcf4cf61a52d5d56f9b5024ce11189f9))

### Dependencies

* bump the angular-dependencies group across 1 directory with 11 updates ([ad0822c](https://github.com/Astro-BEAM-AUTh/portal/commit/ad0822c0196bdd83363cb215a7614896d6ab95e6))
* bump the angular-dependencies group across 1 directory with 11 updates ([36f26b6](https://github.com/Astro-BEAM-AUTh/portal/commit/36f26b6ef0541180f35356bde73c4ddb4b8504a5))
* bump the angular-dependencies group with 11 updates ([1740a3c](https://github.com/Astro-BEAM-AUTh/portal/commit/1740a3ced66e68ee2505e0c3f1d4635f9a90f5b8))
* bump the angular-dependencies group with 11 updates ([c14a9f0](https://github.com/Astro-BEAM-AUTh/portal/commit/c14a9f0244bf9738d78b3789c3c557524d375773))
* bump the angular-dependencies group with 11 updates ([8819d4a](https://github.com/Astro-BEAM-AUTh/portal/commit/8819d4a6f426dda2c6049d57ddb17edfea7e9243))
* bump the angular-dependencies group with 11 updates ([44ff8a4](https://github.com/Astro-BEAM-AUTh/portal/commit/44ff8a48ce42d6c53ae6cca86d5503614fba91a1))
* bump the angular-dependencies group with 11 updates ([bb9d63c](https://github.com/Astro-BEAM-AUTh/portal/commit/bb9d63cdbdbf51f137ad173f70d842ca46956ae4))
* bump the angular-dependencies group with 11 updates ([b2d7c0b](https://github.com/Astro-BEAM-AUTh/portal/commit/b2d7c0bd031b6b9c6c63b6c6ead3b275f23bd89b))
* bump the angular-dependencies group with 11 updates ([64bb3db](https://github.com/Astro-BEAM-AUTh/portal/commit/64bb3db84804a8cfe083bd4553bb30af7ec5f406))
* bump the angular-dependencies group with 11 updates ([09afb23](https://github.com/Astro-BEAM-AUTh/portal/commit/09afb239d630ebb1e435ad377ec40e45cec36d9a))
* bump the npm-dependencies group across 1 directory with 7 updates ([07f2b72](https://github.com/Astro-BEAM-AUTh/portal/commit/07f2b72417e6c44ed9b38898bb44b83ca627cdc9))
* bump the npm-dependencies group with 2 updates ([774fa69](https://github.com/Astro-BEAM-AUTh/portal/commit/774fa69e65f2b706d4113a5026659bb0d31c3a20))
* bump the npm-dependencies group with 2 updates ([9f7e802](https://github.com/Astro-BEAM-AUTh/portal/commit/9f7e80218fee349170ae5e19d75cce4caca5db05))
* bump the npm-dependencies group with 2 updates ([57195a3](https://github.com/Astro-BEAM-AUTh/portal/commit/57195a3d8c6e9b682f25a4c01c0ec783514e7877))
* bump the npm-dependencies group with 3 updates ([b6db237](https://github.com/Astro-BEAM-AUTh/portal/commit/b6db2375df7d64133497ee8f2eb707f0de36bbd8))
* downgrade the lockfile to be aligned with the package.json but reduce vulnerabilities to 0 ([d31b2c4](https://github.com/Astro-BEAM-AUTh/portal/commit/d31b2c42b3f1a898991483adc7902c64974473b6))
* fix ts dependency ([220eebe](https://github.com/Astro-BEAM-AUTh/portal/commit/220eebeed2285b75f5e9b637a9371a2e64d576e3))

### Styles

* format all documents to maintain a consistent style ([42ca1e9](https://github.com/Astro-BEAM-AUTh/portal/commit/42ca1e96d22f9e2898481e242e6aff1dd873a422))

## [1.1.0](https://github.com/Astro-BEAM-AUTh/portal/compare/v1.0.3...v1.1.0) (2026-01-31)

### Features

* Finalize form creation ([faedf21](https://github.com/Astro-BEAM-AUTh/portal/commit/faedf2104ee8ac05f91d02fc354a3b5846828fe3))
* finalized status, added .env support ([96b01ef](https://github.com/Astro-BEAM-AUTh/portal/commit/96b01ef7c1592f770ff07347491624fa8d2c637b))
* migrated to ngx-env ([46ec94b](https://github.com/Astro-BEAM-AUTh/portal/commit/46ec94b6fc103b4701e77bee10f7178dfed6d50b))

### Dependencies

* bump the angular-dependencies group across 1 directory with 10 updates ([da98598](https://github.com/Astro-BEAM-AUTh/portal/commit/da98598192757a30a62aff8a61661f7587d2151d))
* bump the npm-dependencies group across 1 directory with 4 updates ([98f9efe](https://github.com/Astro-BEAM-AUTh/portal/commit/98f9efec28dc41e40c69af745891291e32838675))
* ran npm audit fix ([768d83b](https://github.com/Astro-BEAM-AUTh/portal/commit/768d83bbbb1c192d9217d89998ad0f103b09f8ce))

## [1.0.3](https://github.com/Astro-BEAM-AUTh/portal/compare/v1.0.2...v1.0.3) (2026-01-13)

### Dependencies

* Update to angular v21 ([#13](https://github.com/Astro-BEAM-AUTh/portal/issues/13)) ([9d9dacd](https://github.com/Astro-BEAM-AUTh/portal/commit/9d9dacd4cc3d1975831d69d6acffd7a538185565))

## [1.0.2](https://github.com/Astro-BEAM-AUTh/portal/compare/v1.0.1...v1.0.2) (2026-01-10)

### Dependencies

* bump the npm-dependencies group across 1 directory with 2 updates ([9b187e4](https://github.com/Astro-BEAM-AUTh/portal/commit/9b187e4548230a1f8445b143f169bccde2d879f7))
* bump the npm-dependencies group with 2 updates ([2c360d2](https://github.com/Astro-BEAM-AUTh/portal/commit/2c360d2c63430d13f25820e7de08212ba21cfd77))
* **ci:** add the dependencies needed by semantic release ([018acf8](https://github.com/Astro-BEAM-AUTh/portal/commit/018acf8c05946f2298a4f214bf81d4e026b77ca0))

### CI/CD

* fix the repo url during semantic release ([82c85aa](https://github.com/Astro-BEAM-AUTh/portal/commit/82c85aacbfabe5f33a258e40d534bd9e7279abb4))
* fix the set of types of commits to be analyzed when releasing ([9e59174](https://github.com/Astro-BEAM-AUTh/portal/commit/9e591740ab857d6f63ee0c63dd85304367a1b00e))
* switch to conventionalcommits preset for comprehensive changelog generation ([099226a](https://github.com/Astro-BEAM-AUTh/portal/commit/099226af4d796c6b6390954cfaf9bec03839dd44))

## [1.0.1](https://github.com/Astro-BEAM-AUTh/portal/compare/v1.0.0...v1.0.1) (2025-12-07)
