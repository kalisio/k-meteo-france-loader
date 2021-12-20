# k-meteo-france-loader

[![Latest Release](https://img.shields.io/github/v/tag/kalisio/k-meteo-france-loader?sort=semver&label=latest)](https://github.com/kalisio/k-meteo-france-loader/releases)
[![Build Status](https://travis-ci.com/kalisio/k-meteo-france-loader.png?branch=master)](https://travis-ci.com/kalisio/k-meteo-france-loader)

A [Krawler](https://kalisio.github.io/krawler/) based service to download data from the Météo-France [AROME](https://donneespubliques.meteofrance.fr/?fond=produit&id_produit=131&id_rubrique=51) and [ARPEGE](https://donneespubliques.meteofrance.fr/?fond=produit&id_produit=130&id_rubrique=51) weather forecast models.

## Description

The **k-meteo-france-loader** job allow to scrape raw data (i.e. GRIB files) from the [Météo France web site](https://donneespubliques.meteofrance.fr/). The downloaded data are stored in a target [Object Storage](https://www.mongodb.com/). 

The job is executed according a specific cron expression. By default, every hours.

## Configuration

| Variable | Description |
|--- | --- |
| `TOKEN` | The token to use the API. | - |
| `DB_URL` | The mongoDB database URL. The default value is `mongodb://127.0.0.1:27017/openradiation` |
| `DEBUG` | Enables debug output. Set it to `krawler*` to enable full output. By default it is undefined. |

## Deployment

We personally use [Kargo](https://kalisio.github.io/kargo/) to deploy the service.

## Contributing

Please refer to [contribution section](./CONTRIBUTING.md) for more details.

## Authors

This project is sponsored by 

![Kalisio](https://s3.eu-central-1.amazonaws.com/kalisioscope/kalisio/kalisio-logo-black-256x84.png)

## License

This project is licensed under the MIT License - see the [license file](./LICENSE) for details