# Vision


## API


## Overview
One docker container which:
1. SB parser
- Send query to duckDNS to update dns mapping
- Run a SB parse every day
- Save to DB (In memory neDB)

2. API provider
- Access DB + provide API

