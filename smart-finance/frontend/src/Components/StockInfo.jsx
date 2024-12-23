function StockInfo({Stock}) {
    return <div>
        <h5>{Stock.name}</h5>
        <p>{Stock.price}</p>
    </div>
}

export default StockInfo;