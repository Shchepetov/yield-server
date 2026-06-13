const axios = require('axios');
const utils = require('../utils');

const DUNE_QUERY_ID = 7653028; // per-pool V3 snapshot view (reads balances base 7653018)

const LEGACY_POOL_ADDRESSES = {
  '0x1a0612fe7d0def35559a1f71ff155e344ae69d2c':
    '0x0fa7fb5407ea971694652e6e16c12a52625de1b8',
};

const apy = async () => {
  try {
    const { data } = await axios.get(
      `https://api.dune.com/api/v1/query/${DUNE_QUERY_ID}/results?limit=100`,
      { headers: { 'X-Dune-API-Key': process.env.DUNE_API_KEY }, timeout: 10000 }
    );

    return (data?.result?.rows || [])
      .filter((r) => Number(r.tvl_usd) > 1000)
      .map((r) => ({
        pool: LEGACY_POOL_ADDRESSES[r.pool_address] || r.pool_address,
        chain: utils.formatChain(r.chain),
        project: 'azuro',
        symbol: r.symbol,
        tvlUsd: Number(r.tvl_usd),
        apyBase: Number(r.apy_base) * 100,
        underlyingTokens: [r.underlying_token],
        poolMeta: 'V3 Vault + Locked LP',
        url: 'https://azuro.org/app/liquidity',
      }));
  } catch (error) {
    console.error('Error fetching azuro yield data:', error.message);
    return [];
  }
};

module.exports = {
  timetravel: false,
  apy,
  url: 'https://azuro.org/app/liquidity',
};
