const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk')
const ethers  = require('ethers')
require('dotenv').config();
// main net
// console.log(`The chainId of mainnet is ${ChainId.MAINNET}.`)
// const chainId = ChainId.MAINNET;
// const DAITokenAddress = '0x6b175474e89094c44da98b954eedeac495271d0f'
const { PRIVATE_KEY, PRIVATE_KEY_l, API_URL_rinkeby } = process.env;


console.log(`The chainId of mainnet is ${ChainId.RINKEBY}.`)
const chainId = ChainId.RINKEBY;
const DAITokenAddress = '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735'

const provider = new ethers.providers.JsonRpcProvider(API_URL_rinkeby)
const signer = new ethers.Wallet(PRIVATE_KEY_l)
const account = signer.connect(provider)
const abiFunction = ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)']
const contractUniSwap = new ethers.Contract('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',abiFunction, account)
// console.log("account", account)

const init = async () => {

    const dai = await Fetcher.fetchTokenData(chainId, DAITokenAddress)
    const weth = WETH[chainId]
    // console.log("DAI : ", dai)
    // console.log("WETH : ", weth)
    const daiwethPair = await Fetcher.fetchPairData(dai, weth)
    const route = new Route([daiwethPair], weth)
    console.log("Quote : ", route.midPrice.toSignificant(6))
    console.log("Quote : ", route.midPrice.invert().toSignificant(6))

    const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT)
    console.log("Trade : ", trade.executionPrice.toSignificant(6))
    console.log("Trade : ", trade.nextMidPrice.toSignificant(6))

    // main trading

    const slippageTolerance = new Percent(10, 100)
    const amountOutMin = trade.minimumAmountOut(slippageTolerance);
    console.log("error : ",amountOutMin)
    const path = [weth.address, dai.address];
    const to = signer.address;
    const deadLine = Math.floor(Date.now() / 1000 + 60 * 10) // 10 minutes
    const value = trade.inputAmount.raw;

    const tx = await contractUniSwap.swapExactETHForTokens(
        amountOutMin,
        path,
        to,
        deadLine,
        {value, gasPrice: 50e9}
    )

    console.log(`Transaction Hash : ${tx.hash}`)

    const receipt = await tx.wait()
    console.log(`Transaction was mined in ${receipt.blockNumber}`)
}


init()