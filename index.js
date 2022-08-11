const { ChainId, Fetcher, WETH, Route } = require('@uniswap/sdk')


console.log(`The chainId of mainnet is ${ChainId.RINKEBY}.`)

const chainId = ChainId.RINKEBY;

const DAITokenAddress = '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735'

const init = async () => {

    const dai = await Fetcher.fetchTokenData(chainId, DAITokenAddress)
    const weth = WETH[chainId]
    console.log("DAI : ", dai)
    console.log("WETH : ", weth)
    const daiwethPair = await Fetcher.fetchPairData(dai, weth)
    const route = new Route([daiwethPair], weth)
}


init()