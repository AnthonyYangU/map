data = {
    cloud: "91",
    cond_code: "104",
    cond_txt: "阴",
    fl: "30",
    hum: "41",
    pcpn: "0.0",
    pres: "999",
    tmp: "30",
    vis: "1600", //*1000
    wind_deg: "156",
    wind_dir: "东南风",
    wind_sc: "2",
    wind_spd: "9",
    icao: 'ZBDT',
    time: '180557',
    instant_windSpd: "10",
    change_windDeg: "10",
    windDegMin: "10",
    windDegMax: "20",
    runwayNumber: "20L",
    rvr_10min: "1800",
    rvr_5min1: "1700",
    rvr_5min2: "1900",
    rvr_1min: ["1700", "1700", "1700", "1700", "1700", "1700", "1700", "1700", "1700", "1700"],
    lastCond_txt: "雷阵雨",
    few: "60",
    sct: "270",
    bkn: "1050",
    verticalVis: "10000",
    dew: "13",
    qnh: "999",
    midWeather: "阴"
}

const specialWeatherMap = {
    "飓风": "SQ",
    "龙卷风": "FC",
    "热带风暴": "SQ",
    "阵雨": "SHRA",
    "强阵雨": "+SHRA",
    "雷阵雨": "TSSHRA",
    "强雷阵雨": "+TSSHRA",
    "雷阵雨伴有冰雹": "TSSHRAGR",
    "小雨": "-RA",
    "中雨": "RA",
    "毛毛雨": "DZ",
    "暴雨": "+RA",
    "大暴雨": "+RA",
    "特大暴雨": "+RA",
    "冻雨": "FZRA",
    "小到中雨": "-RA",
    "中到大雨": "RA",
    "大到暴雨": "+RA",
    "暴雨到大暴雨": "+RA",
    "大暴雨到特大暴雨": "+RA",
    "雨": "RA",
    "小雪": "-SN",
    "中雪": "SN",
    "大雪": "+RN",
    "暴雪": "+SN",
    "雨夹雪": "SNRA",
    "雨雪天气": "SNRA",
    "阵雨夹雪": "SHSNRA",
    "阵雪": "SHSN",
    "小到中雪": "-SN",
    "中到大雪": "SN",
    "大到暴雪": "+SN",
    "雪": "SN",
    "薄雾": "BR",
    "雾": "FG",
    "霾": "HZ",
    "扬沙": "SA",
    "浮尘": "PO",
    "沙尘暴": "SSDS",
    "强沙尘暴": "+SSDS",
    "浓雾": "+FG",
    "强浓雾": "+FG",
    "中度霾": "HZ",
    "大雾": "+FG",
    "特强浓雾": "+FG",
}

const importantWeather = {
    "飓风": "SQ",
    "龙卷风": "FC",
    "热带风暴": "SQ",
    "阵雨": "SHRA",
    "强阵雨": "+SHRA",
    "雷阵雨": "TSSHRA",
    "强雷阵雨": "+TSSHRA",
    "雷阵雨伴有冰雹": "TSSHRAGR",
    "中雨": "RA",
    "暴雨": "+RA",
    "大暴雨": "+RA",
    "特大暴雨": "+RA",
    "冻雨": "FZRA",
    "中到大雨": "RA",
    "大到暴雨": "+RA",
    "暴雨到大暴雨": "+RA",
    "大暴雨到特大暴雨": "+RA",
    "中雪": "SN",
    "大雪": "+RN",
    "暴雪": "+SN",
    "中到大雪": "SN",
    "大到暴雪": "+SN",
    "扬沙": "SA",
    "浮尘": "PO",
    "沙尘暴": "SSDS",
    "强沙尘暴": "+SSDS",
    "浓雾": "+FG",
    "强浓雾": "+FG",
    "中度霾": "HZ",
    "大雾": "+FG",
    "特强浓雾": "+FG",
}

function messageAnalyse(data) {
    let message = "METAR";
    //ICAO 规定的地名代码表示
    let CCCC = data.icao;
    message = message + " " + CCCC;
    //观测日期和时间
    let YYGGggZ = data.time;
    message = message + " " + YYGGggZ;
    //(AUTO)在风组前编报AUTO组
    let auto = "AUTO";
    message = message + " " + auto;


    //以真北为基准，观测前十分钟内平均风向（风的来向），个位数按照四舍五入化为最接近10的整数；和平均风速，风向值小于100时，其前应该加‘0’，正北风向编报为360°, 当10min内包含风的明显不连续特征时，按不连续出现之后的数据求解
    ///ddd表示风向，ff表示风速，G表示阵风（只有当最大阵风风速比平均风速大5m/s以上时，才报告），fmfm为阵风风速，MPS为固定值
    let dddffGfmfmMPS, ddd, ff, fmfm;

    //在观测前10min内，如果风向变化大于或者等于60，但是小于180，且风速大于2m/s
    let dndndnVdxdxdx = "";
    let fmfm;
    let dndndn, dxdxdx;
    if (data.wind_spd.parseInt() == 0 && data.wind_deg.parseInt() == 0) {
        //静风
        ddd = '000'
        ff = '00'
    } else {
        ddd = averageWindSpeed(data.wind_deg);
        if (data.change_windDeg.parseInt() >= 180 || (data.change_windDeg.parseInt() >= 60 && data.change_windDeg.parseInt() <= 180 && data.wind_spd < 2)) {
            //表示风向不定
            ddd = "VRB"
        }
        if (data.change_windDeg.parseInt() >= 60 && data.change_windDeg.parseInt() <= 180 && data.wind_spd >= 2) {
            dndndn = addZero(data.windDegMin, 3);
            dxdxdx = addZero(data.windDegMax, 3);
            dndndnVdxdxdx = dndndn + "V" + dxdxdx
        }
        ff = data.wind_spd < '10' ? '0' + data.wind_spd : data.wind_spd
    }
    //当风速大于等于50m/s时，"ff"和""fmfm"前加指示码"P"
    if (data.wind_spd >= 50) {
        ff = 'P' + ff;
    }
    dddffGfmfmMPS = ddd + ff
    if (data.instant_windSpd.parseInt() - data.wind_spd.parseInt() > 5) {
        fmfm = data.instant_windSpd;
        if (fmfm.parseInt() >= 50) {
            fmfm = "P" + fmfm;
        }
        dddffGfmfmMPS = dddffGfmfmMPS + "G" + data.instant_windSpd
    }
    dddffGfmfmMPS = dddffGfmfmMPS + "MPS";
    message = message + " " + dddffGfmfmMPS;
    if (dndndnVdxdxdx != "") {
        message = message + " " + dndndnVdxdxdx;
    }


    //能见度应当按照下列增量等级编报
    // a)能见度小于800m时，以50m为等级编报
    // b)能见度大于等于800m且小于5000m时，以100m为等级编报
    // b)能见度大于等于5000m且小于10000m时，以1000m为等级编报
    // d)能见度大于等于10000时，报告"9999"（但是适用于"CAVOK"的条件时除外)
    // 向下取整
    //CAVOK:
    // 1.能见度大于10km
    // 2.在5000ft以下或最高和最低扇区安全高度内，没有云并且没有积雨云
    // 3.机场附近没有重要天气
    if (data.vis >= "10000" && (data.few == null && data.sct == null) && !(data.cond_txt in importantWeather)) {
        message = message + " " + "CAVOK"
    } else {
        let VVVV;
        if (data.vis >= '10000') {
            VVVV = "9999"
        } else {
            VVVV = data.vis;
        }



        // 跑道视距
        let RDrDr_VrVrVrVri, RDrDr, rvri;
        let RDrDr_VrVrVrVrVVrVrVrVr;
        if (data.vis < '1500') {
            RDrDr = "R" + data.runwayNumber;

            if (rvr_5min2.parseInt() - rvr_5min1.parseInt() > 100) {
                rvri = "U"
            }
            if (rvr_5min2.parseInt() - rvr_5min1.parseInt() < -100) {
                rvri = "D"
            }

            let maxRvR = Math.max(...data.rvr_1min);
            let minRvR = Math.min(...data.rvr_1min);
            if (Math.abs(maxRvR - rvr_10min) < 50 || Math.abs(maxRvR - rvr_10min) < rvr_10min * 0.2) {
                RDrDr_VrVrVrVrVVrVrVrVr = RDrDr + "/" + minRvR + "V" + maxRvR + rvri;
                message = message + " " + RDrDr_VrVrVrVrVVrVrVrVr;
            } else {
                RDrDr_VrVrVrVri = RDrDr + "/" + rvr_10min + rvri
                message = message + " " + RDrDr_VrVrVrVri;
            }
        }

        //w'w' 天气现象组
        let ww;
        if (data.lastCond_txt in importantWeather && !(data.cond_txt in importantWeather)) {
            message = message + " " + "NSW"
        }
        if (data.cond_txt in specialWeatherMap) {
            ww = data[data.cond_txt];
            message = message + " " + ww;
        }

        //云组
        let NsNsNshshshs;
        if (data.cond_txt = "晴") {
            message = message + " " + "SKC"
        } else {
            if (data.few == null && data.sct == null && data.bkn == null) {
                message = message + " " + "VV" + data.verticalVis.parseInt() / 30;
            }

            if (data.few != null) {
                message = message + " " + "FEW" + cloudAddZero(data.few, 3);
            }
            if (data.sct != null) {
                message = message + " " + "SCT" + cloudAddZero(data.sct, 3);
            }
            if (data.bkn != null) {
                message = message + " " + "BKN" + cloudAddZero(data.bkn, 3)
            }
        }
    }
    //气温和露点温度,TmTm温度
    let TmTmTdTd, TmTm, TdTd;
    TmTm = Math.round(data.tmp.parseInt());
    TdTd = Math.round(data.dew.parseInt());
    if (TmTm < 10 && TmTm >= 0) {
        TmTm = '0' + TmTm
    } else if (TmTm > -10 && TmTm < 0) {
        TmTm = 'M0' + Math.abs(TmTm)
    }

    if (TdTd < 10 && TdTd >= 0) {
        TdTd = '0' + TdTd
    } else if (TdTd > -10 && TdTd < 0) {
        TdTd = 'M0' + Math.abs(TdTd)
    }
    TmTmTdTd = TmTm + "/" + TdTd;
    message = message + " " + TmTmTdTd;

    //修正海压
    let QNH;
    QNH = addZero(data.qnh, 4);
    message = message + " Q" + QNH;

    if (data.midWeather in importantWeather && data.cond_txt != data.midWeather) {
        message = message + " RE" + specialWeatherMap[data.midWeather];
    }
    //近时天气现象

    return message.toUpperCase();
}

function averageWindDeg(data) {
    let value = data.parseInt()
    let num = Math.round(value / 10) * 10;
    if (num == 0) {
        num = 360;
    }
    let string = num.toString;
    while (string.length < 3) {
        string = '0' + string;
    }
    return string;
}

function cloudAddZero(data, zeroNum) {
    let value = data.parseInt()
    let num = value / 30;
    let string = num.toString;
    while (string.length < zeroNum) {
        string = '0' + string;
    }
    return string;
}

function addZero(data, zeroNum) {
    while (data.length < zeroNum) {
        string = '0' + string;
    }
    return string;
}


export {
    messageAnalyse
}