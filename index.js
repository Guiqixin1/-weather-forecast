// KEY = 5b396eb8ab7c4beaa44629420a197903
// KEY名称：gqx
// public ID = HE2307251143361355       `


// 页面一打开的默认渲染城市函数
// 城市id
// let cityId;
let key = '5b396eb8ab7c4beaa44629420a197903';
// let key = 'e17d8b658a584e919da31c9953b5bf27'
var cityId;
async function FirstCity(CityId) {
    cityId = CityId;
    getCtCurrent();
    getCt_Hours();
    getCt_7_days();
    if (localStorage.getItem(CityId)) {
        document.getElementById('btn-attention').innerHTML = `[已关注]`;
    }
    else{
        document.getElementById('btn-attention').innerHTML = `[添加关注]`;
    }
  
}
FirstCity('101010100')


// 实时天气模块
async function getCtCurrent() {
    const res = await axios.get(`https://devapi.qweather.com/v7/weather/now?location=${cityId}&key=${key}`);
    // console.log(res);
    const strTime = (res.data.now.obsTime).substring(11, 16);
    // console.log(typeof res.data.now.obsTime);
    document.getElementById('txt-pub-time').innerHTML = `中央气象台${strTime}发布`
    document.getElementById('txt-temperature').innerHTML = `${res.data.now.temp}°`;
    document.getElementById('txt-name').innerHTML = res.data.now.text;
    document.getElementById('txt-wind').innerHTML = `${res.data.now.windDir} ${res.data.now.windScale}级`
    document.getElementById('txt-humidity').innerHTML = `湿度 ${res.data.now.humidity}`;
    document.getElementById('txt-kPa').innerHTML = `气压 ${res.data.now.pressure}hpa`
    // 天气太热
    document.getElementById('btn-tip-switch').addEventListener('click', function () {
        const tip = document.getElementById('txt-tips');
        if (tip.textContent === '天太热了，吃个西瓜~') {
            tip.innerHTML = `你若安好，便是晴天~`;
        }
        else {
            tip.innerHTML = `天太热了，吃个西瓜~`;
        }
    })
}

// 逐小时天气模块
async function getCt_Hours() {
    const res = await axios.get(`https://devapi.qweather.com/v7/weather/24h?location=${cityId}&key=${key}`);
    // console.log(res);
    let dataStr = '';
    dataStr = res.data.hourly.map(item =>
        `<li class="item">
        <p class="txt-time">${item.fxTime.substring(11, 16)}</p>
        <img src="./node_modules/qweather-icons/icons/${item.icon}-fill.svg" alt="${item.text}" title="${item.text}" class="icon">
        <p class="txt-degree">${item.temp}°</p>
        </li>`
    ).join(``)
    // console.log(dataStr);
    document.getElementById('Is-weather-hour').innerHTML = dataStr;
    // 轮播图效果
    const btnItem = document.getElementById('ct-weather');
    const computedStyle = window.getComputedStyle(btnItem)
    let btnValue = computedStyle.getPropertyValue('margin-left')
    // console.log(btnValue);
    document.getElementById('btn-next').addEventListener('click', function () {
        if (btnValue === '24px') {
            btnItem.style.marginLeft = '-1010px';
            btnValue = '-1010px'
        }
    })
    document.getElementById('btn-prev').addEventListener('click', function () {
        if (btnValue === '-1010px') {
            btnItem.style.marginLeft = '24px';
            btnValue = '24px';
        }
    })

}

// 七日天气预报
async function getCt_7_days() {
    const res = await axios.get(`https://devapi.qweather.com/v7/weather/7d?location=${cityId}&key=${key}`);
    // console.log(res);
    let dataStr = res.data.daily.map((item, index) => {
        if (index === 0) {
            return `
            <li class="item second" style="width: 92px">
                <p class="day">今日</p>
                <p class="date">${item.fxDate.substring(5, 7)}月${item.fxDate.substring(8)}日</p>
                <div class="ct-daytime">
                    <p class="weather">${item.textDay}</p>
                    <img class="icon" src="./node_modules/qweather-icons/icons/${item.iconDay}-fill.svg" alt="${item.textDay}" title="${item.textDay}">
                </div>
                <div class="ct-night"> <img class="icon" src="./node_modules/qweather-icons/icons/${item.iconNight}-fill.svg" alt="${item.textNight}" title="${item.textNight}">
                    <p class="weather">${item.textNight}</p>
                </div>
                <p class="wind">微风 ${item.windScaleDay}级</p>
            </li>
            `
        }
        else {
            return `
            <li class="item" style="width: 92px">
                <p class="day">${getDayOfWeek(item.fxDate)}</p>
                <p class="date">${item.fxDate.substring(5, 7)}月${item.fxDate.substring(8)}日</p>
                <div class="ct-daytime">
                    <p class="weather">${item.textDay}</p>
                    <img class="icon" src="./node_modules/qweather-icons/icons/${item.iconDay}-fill.svg" alt="${item.textDay}" title="${item.textDay}">
                </div>
                <div class="ct-night"> <img class="icon" src="./node_modules/qweather-icons/icons/${item.iconNight}-fill.svg" alt="${item.textNight}" title="${item.textNight}">
                    <p class="weather">${item.textNight}</p>
                </div>
                <p class="wind">微风 ${item.windScaleDay}级</p>
            </li>
            `
        }
    }
    ).join('')
    // console.log(dataStr);
    document.getElementById('ls-weather-day').innerHTML = dataStr;

}
// 根据日期判断周几的函数
function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    //getDay() 是 Date 对象的一个方法，用于获取一个表示星期几的整数值。
    const dayOfWeek = date.getDay();

    return days[dayOfWeek];
}

// // 生活指数
function LiveValue() {
    document.querySelectorAll('.ct-sub').forEach(item => {
        item.addEventListener('mouseenter', function (e) {
            // console.log(e.target);
            e.target.style.top = '-120px';
            // 获取detail
            const detile = e.target.nextElementSibling;
            // console.log(detile);
            detile.style.top = '0px'
        })
    })
    document.querySelectorAll('.ct-detail').forEach(item => {
        item.addEventListener('mouseleave', function (e) {
            e.target.style.top = '120px';
            const detile = e.target.previousElementSibling;
            detile.style.top = '0px'
        })
    })

    // 轮播图效果
    const parent = document.getElementById('ct-living-index').firstElementChild;
    const childPrev = parent.firstElementChild;
    const childNext = parent.lastElementChild;
    // console.log(childPrev);
    // console.log(childNext);
    const u1 = document.getElementById('ls-living1');
    const u2 = document.getElementById('ls-living2')
    childNext.addEventListener('click', function (e) {
        u1.style.left = '-374px';
        u2.style.left = '0px'
    })
    childPrev.addEventListener('click', function (e) {
        u1.style.left = '0px'
        u2.style.left = '374px'
    })
}
LiveValue()



// 搜索城市
// 搜索框的聚焦和失焦状态的设置(foucs和blur)
document.getElementById('i-location').addEventListener('focus', function () {
    document.getElementById('ct-hot-city').style.display = 'block';
})
document.getElementById('i-location').addEventListener('blur', function () {
    setTimeout(() => {
        document.getElementById('ct-hot-city').style.display = 'none';
        document.getElementById('ls-match').style.display = 'none';
        document.getElementById('ls-match').innerHTML = ``;
        document.getElementById('i-location').value = '';
    }, 200);

    
})


// 关注的城市列表
function AttentionList() {

    var hideState = false;
    function divShow() {
        // showTimer = setTimeout(function () {
        //     document.getElementById('ct-attention').style.display = 'block';
        // }, 100)
        document.getElementById('ct-attention').style.display = 'block';
    }
    function divHide() {
        // hideTime = setTimeout(function () {
        //     document.getElementById('ct-attention').style.display = 'none';
        // }, 100)
        document.getElementById('ct-attention').style.display = 'none';
    }
    document.getElementById('ct-show').addEventListener('mouseover', function () {
        divShow()
        // console.log('1');
    })
    document.getElementById('ct-show').addEventListener('mouseleave', function () {
        if (!hideState) {
            divHide()
        }
        else {
            divShow()
        }
        // console.log('2');
    })

    document.getElementById('ct-attention').addEventListener('mouseover', function () {
        hideState = true;
        divShow();
        // console.log(3);
    })
    document.getElementById('ct-attention').addEventListener('mouseleave', function () {
        divHide();
        hideState = false;
        // console.log(4);
    })
    setInterval(() => {
        document.querySelectorAll('.city').forEach(item =>{
            item.addEventListener('click', async function(e){
                // console.log(item.dataset.city);
                // 点击关注城市切换的功能
                const res = await axios.get(`https://geoapi.qweather.com/v2/city/lookup?location=${item.dataset.city}&key=${key}`);
                cityId = res.data.location[0].id
                document.getElementById('txt-cur-location').innerHTML = `${res.data.location[0].adm1}  ${res.data.location[0].adm2}`;
                
                document.getElementById('cur-location').innerHTML = `${res.data.location[0].adm2}`;
                FirstCity(cityId);
                if(e.target.classList.contains('btn-delete')){
                    localStorage.removeItem(cityId);
                    cityAttention()
                }
            })
            // console.log(item);
        })
    }, 600);
}
AttentionList()



// 搜索框函数
function searchCity() {
    let dataInput;
    // 获取表单数据 --- 实时获取表单数据
    document.getElementById('i-location').addEventListener('input', async function (e) {
        e.preventDefault();
        dataInput = e.target.value
        // console.log(dataInput);
        document.getElementById('ct-hot-city').style.display = 'none';
        // 发送ajax获取城市
        const res = await axios.get(`https://geoapi.qweather.com/v2/city/lookup?location=${dataInput}&key=${key}&range=cn`);
        // console.log(res);
        // 将返回的结果渲染到item里面
        const ul = document.getElementById('ls-match');
        ul.style.display = 'block';
        if (res.data.code === '404') {
            ul.innerHTML = `
                <li class="item">
                 <span> 抱歉，未找到相关位置</span>
                </li>
                `
        }
        else {
            let data = res.data.location.map(item => `
                <li class="item" data-city = ${item.name}>
                    <span>${item.adm1}</span>
                    <span>${item.adm2}</span>
                </li> 
                
                `).join(``)
            ul.innerHTML = data;
        }
        if (dataInput === '') {
            ul.style.display = 'none';
            document.getElementById('ct-hot-city').style.display = 'block';
        }
        const parentNode = document.getElementById('ls-match');
        const childeNode = parentNode.childNodes;
        childeNode.forEach(item =>{
            // console.log(111);
            // console.log(item);
            item.addEventListener('click',async function (){
                const res = await axios.get(`https://geoapi.qweather.com/v2/city/lookup?location=${item.dataset.city}&key=${key}`);
                cityId = res.data.location[0].id
                document.getElementById('txt-cur-location').innerHTML = `${res.data.location[0].adm1}  ${res.data.location[0].adm2}`;
               
                // document.getElementById('cur-location').innerHTML = `${res.data.location[0].adm2}`
                FirstCity(cityId)
            })
        })

    });
}
searchCity()



// 点击城市名字实现页面切换
function changeCity() {
    document.querySelectorAll('.opts').forEach(item => {
        item.addEventListener('click', async function () {
            const res = await axios.get(`https://geoapi.qweather.com/v2/city/lookup?location=${item.dataset.city}&key=${key}`);
            cityId = res.data.location[0].id
            document.getElementById('txt-cur-location').innerHTML = `${res.data.location[0].adm1}  ${res.data.location[0].adm2}`;
            FirstCity(cityId)
            if (!localStorage.getItem(cityId)) {
                document.getElementById('btn-attention').innerHTML = `[添加关注]`
            }
            else {
                document.getElementById('btn-attention').innerHTML = `[已关注]`
            }
            
        })



    })

}
changeCity()

// 关注的城市的按钮
function cityAttentionBtn() {
    // hasattention
    document.querySelector('.hasAttention').addEventListener('click', function (e) {
        if (e.target.innerHTML === `[添加关注]`) {
            document.getElementById('btn-attention').innerHTML = `[已关注]`;
            localStorage.setItem(cityId, `${cityId}`);
            console.log('已添加关注的城市' + localStorage.getItem(cityId));
            // 添加之后，需要立马从新渲染
            cityAttention()
        }
    })
}
cityAttentionBtn()
// 关注的城市
async function cityAttention() {
    let attentionStr = '';
    // 城市id数组的长度进行遍历
    let keys = Object.keys(localStorage);
    for (let i = 0; i < keys.length; i++) {
        const res = await axios.get(`https://devapi.qweather.com/v7/weather/3d?location=${keys[i]}&key=${key}`);
        const lookup = await axios.get(`https://geoapi.qweather.com/v2/city/lookup?location=${keys[i]}&key=${key}`)
        console.log(res);
        // console.log(lookup);
        attentionStr += `
                <li class="city" data-province="${lookup.data.location[0].adm1}" data-city="${lookup.data.location[0].adm2}" data-district=""> 
                    <div class="ct-location"> 
                        <p class="location">${lookup.data.location[0].name}</p> 
                         <a href="javascript:;" class="btn btn-set-default">设为默认</a>  
                    </div>
                     <img class="icon" src="./node_modules/qweather-icons/icons/${res.data.daily[0].iconDay}-fill.svg" alt="${res.data.daily[0].textDay}" title="${res.data.daily[0].textDay}"> 
                     <p class="weather">${res.data.daily[0].textDay}</p> 
                     <p class="temperature">${res.data.daily[0].tempMin}°/${res.data.daily[0].tempMax}°</p> 
                     <a href="javascript:;" class="btn btn-delete"></a> 
                     </li>

                `
    }
    document.getElementById('ls-attention').innerHTML = attentionStr;


}
cityAttention()





// 渲染今日天气详情  ct-current部分
// async function getCtCurrent (){
//     const res = await axios.get('https://api.qweather.com/v7/weather/now?location')
// }
