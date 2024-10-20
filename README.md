# universal-doh

This project is a work in progress.

## Current Status

As of now, a very simple implementation of the `resolve()` function is available.
It currently return a string, and this will definitely change in the (near) future.

The resolver uses DoH POST method and handles IDN domains and EDNS0 message padding
already. Currently it uses Cloudflare DNS server, but this will be configurable
in the future.

## Getting Started

To get started with the current state of this project, follow these steps:

1. Clone the repository
2. Install the dependencies using `npm install`
3. Run the project using `npm dev` to play around with the resolver in your browser

It is not available as a package yet, as it is still in a very early stage.
