import asyncHandler from "express-async-handler";
import axios from "axios";

const FINNHUB_API_KEY = "cn0qd0pr01quegsk27sgcn0qd0pr01quegsk27t0";


const getPreviousWeekday = (date) => {
    let day = date.getDay();
    // If it's Sunday (0), go back to Friday (5)
    // If it's Monday (1), go back to Friday (5) by subtracting 3 days
    if (day === 0 || day === 1) {
        date.setDate(date.getDate() - (day + 2));
    } else {
        // Otherwise, just go back one day to the previous weekday
        date.setDate(date.getDate() - 1);
    }
    return date;
};


// Function to format date
const formatDate = (date) => {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // January is 0!
    let dd = date.getDate();

    dd = dd < 10 ? `0${dd}` : dd;
    mm = mm < 10 ? `0${mm}` : mm;

    return `${yyyy}-${mm}-${dd}`;
};

const get_hourly_charts_data = async(symbol,market_status) => {
    let from_date, to_date;
    const now = new Date();

    if (market_status === "open") {
        // Market is open: set from_date to yesterday and to_date to today
        from_date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        to_date = new Date(now);
    } else {
        // Market is closed: find the last closing date
        // Assuming "now" could be a weekend or a holiday, find the last weekday
        to_date = getPreviousWeekday(new Date(now));
        from_date = new Date(to_date.getFullYear(), to_date.getMonth(), to_date.getDate());
        from_date.setDate(to_date.getDate() - 1); // Set to one day before the last closing date
    }

    let fromDate = formatDate(from_date);
    let toDate = formatDate(to_date);
    const multiplier = 1;
    const timespan = "hour";
    const polygon_api_key = "ArQhYRqtoUo6Aq3njzHaI6EH9AscYZwp";
    const query_string = `adjusted=true&sort=asc&apiKey=${polygon_api_key}`;

    const hourly_charts_url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${fromDate}/${toDate}?${query_string}`;
    let hourly_charts_data = await axios.get(hourly_charts_url);
    // console.log(hourly_charts_data.data.results);
    const filtered_charts_data = hourly_charts_data.data.results.map(item => ({
        c: item.c,
        t: item.t
    }));
    console.log(filtered_charts_data);
    return filtered_charts_data;
};

const getCompanyNews = asyncHandler(async(req, res)=>{
    const { symbol } = req.body;
    try {
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setDate(toDate.getDate() - 2);
        const formattedToDate = formatDate(toDate);
        const formattedFromDate = formatDate(fromDate);
        const company_news_url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${formattedFromDate}&to=${formattedToDate}&token=${FINNHUB_API_KEY}`;
        const company_news_data = await axios.get(company_news_url);

        const filteredNewsData = company_news_data.data.filter(article => {
            const requiredKeys = ['image', 'url', 'headline', 'datetime', 'source', 'summary'];
            return requiredKeys.every(key => article[key] !== undefined && article[key] !== null && article[key] !== '');
        });

        const response = filteredNewsData.slice(0, 20);
        console.log(response.length,"length");
    
        res.status(200).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve company news details", error: error.message });
    }

});

const getInsights = asyncHandler(async(req, res)=>{
    const { symbol } = req.body;
    try {
        const insider_sentiments_url = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&from=2022-01-01&&token=${FINNHUB_API_KEY}`;
        let insider_sentiment_data = await axios.get(insider_sentiments_url);
        // console.log(insider_sentiment_data.data.data);

        const aggregates = insider_sentiment_data.data.data.reduce(
            (acc, item) => {
              // Aggregate total mspr
              acc.total_mspr += item.mspr;
              // Aggregate positive mspr
              if (item.mspr > 0) acc.positive_mspr += item.mspr;
              // Aggregate negative mspr
              if (item.mspr < 0) acc.negative_mspr += item.mspr;
              // Aggregate total change
              acc.total_change += item.change;
              // Aggregate positive change
              if (item.change > 0) acc.positive_change += item.change;
              // Aggregate negative change
              if (item.change < 0) acc.negative_change += item.change;
              
              return acc;
            },
            {
              total_mspr: 0,
              positive_mspr: 0,
              negative_mspr: 0,
              total_change: 0,
              positive_change: 0,
              negative_change: 0
            }
        );
          
        // Round off all aggregates to 2 decimal places
        const roundedAggregates = Object.keys(aggregates).reduce((acc, key) => {
            acc[key] = Number(aggregates[key].toFixed(2));
            return acc;
        }, {});
        // console.log(roundedAggregates);


        const recommendation_trends_url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const recommendation_trends_data = await axios.get(recommendation_trends_url);
        // console.log(recommendation_trends_data.data);

        const company_earnings_url = `https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const company_earnings_data = await axios.get(company_earnings_url);
        // console.log(company_earnings_data.data);

        const updated_earnings_data = company_earnings_data.data.map(earning => ({
            ...earning,
            actual: earning.actual ?? 0,
            estimate: earning.estimate ?? 0,
            surprise: earning.surprise ?? 0,
            surprisePercent: earning.surprisePercent ?? 0,
        }));

        const response_obj = {
            "insider_sentiments": roundedAggregates,
            "recommendation_trends": recommendation_trends_data.data,
            "company_earnings_data": updated_earnings_data
        }
        

        res.status(200).send(response_obj);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve company insider sentiments", error: error.message });
    }
});

const getStockDetails = asyncHandler( async (req,res) => {
    const { symbol } = req.body;
    console.log(symbol);
    try {
        const stock_profile_url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        let stock_profile_response = await axios.get(stock_profile_url);
        console.log(stock_profile_response.data);
        let {ticker, name, exchange, logo, ipo, finnhubIndustry, weburl} = stock_profile_response.data;

        const stock_quote_url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        let stock_quote_response = await axios.get(stock_quote_url);
        console.log(stock_quote_response.data);
        let {c, d, dp, t, h, l, o, pc} = stock_quote_response.data;

        const company_peers_url = `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        let company_peers_reponse = await axios.get(company_peers_url);
        let company_peers = company_peers_reponse.data.filter(peer => !peer.includes('.'));
        console.log( company_peers,"peers data");


        //converting t to required format
        const date = new Date(t * 1000);
        const formattedDate = 
            date.getFullYear() + "-" +
            ("0" + (date.getMonth() + 1)).slice(-2) + "-" + 
            ("0" + date.getDate()).slice(-2) + " " +
            ("0" + date.getHours()).slice(-2) + ":" +
            ("0" + date.getMinutes()).slice(-2) + ":" +
            ("0" + date.getSeconds()).slice(-2);
        console.log(t,"t");

        // Get the current date and time
        const now = new Date();

        // Get the current day of the week (0 is Sunday, 1 is Monday, ..., 6 is Saturday)
        const dayOfWeek = now.getDay();
        console.log(dayOfWeek,"dayOfWeek");

        // Get the current time in hours and minutes
        const hours = now.getHours();
        const minutes = now.getMinutes();
        console.log(hours,"hours",minutes,"minutes");

        // Define market opening and closing times
        const openingTime = { hours: 6, minutes: 30 }; // 6:30 AM
        const closingTime = { hours: 13, minutes: 0 }; // 1:00 PM

        // Convert current time and opening/closing times to minutes for easier comparison
        const currentTimeInMinutes = hours * 60 + minutes;
        const openingTimeInMinutes = openingTime.hours * 60 + openingTime.minutes;
        const closingTimeInMinutes = closingTime.hours * 60 + closingTime.minutes;

        // Check if the current time is within the market hours (Monday to Friday, between 6:30 AM and 1:00 PM)
        let market_status = "closed";
        if (dayOfWeek >= 1 && dayOfWeek <= 5 && // Monday to Friday
            currentTimeInMinutes >= openingTimeInMinutes && 
            currentTimeInMinutes < closingTimeInMinutes) {
            market_status = "open";
        }

        const filtered_charts_data= await get_hourly_charts_data(symbol,market_status);

       



        const res_obj = {
            "stock_details" : {
                "ticker": ticker,
                "name": name,
                "exchange": exchange,
                "logo": logo, 
                "last_price": c,
                "change": d,
                "change_percentage": dp,
                "current_timestamp": formattedDate,
                "market_status": market_status
            },
            "summary":{
                "high_price": h,
                "low_price":l,
                "open_price":o,
                "prev_close":pc
            },
            "company_details":{
                "ipo_start_date": ipo,
                "industry": finnhubIndustry,
                "webpage": weburl,
                "company_peers": company_peers
            },
            "hourly_charts_data": filtered_charts_data,

            
        }
        res.status(200).json(res_obj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve stock details", error: error.message });
    }

   
});



export {getStockDetails, getCompanyNews, getInsights};