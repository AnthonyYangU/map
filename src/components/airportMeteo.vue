<template>
    <div style="width:100%">
        <!-- <el-button type="primary" @click="test">测试</el-button> -->
        <!-- <div class="container"></div> -->
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">机场天气</el-menu-item>
            <el-menu-item index="2">趋势分析</el-menu-item>
        </el-menu>

        <div v-show="activeIndex == '1'">
            <div class="ar-head">
                <span>{{messageNow}}</span>
                <span>{{realPublishTime}}更新</span>
            </div>
            <div class="ar-body" v-if="arStatus">
                <div class="ar-td">
                    <div>
                        <img :src="require('../assets/meteopic/'+imgsrc+'.png')" alt="#" height="64" width="64" />
                    </div>
                    <div style="font-size:46px">
                        <span>{{temperature}}</span>
                        <sup style="font-size:14px">℃</sup>
                    </div>
                    <div>{{cond_txt}}</div>
                    <div>温度</div>
                </div>
                <table width="100%">
                    <tr>
                        <td class="label">云量:</td>
                        <td>{{cloud}}%</td>
                        <td class="label">露点温度:</td>
                        <td>{{hum}}℃</td>
                    </tr>
                    <tr>
                        <td class="label">能见度:</td>
                        <td>{{vis}}km</td>
                        <td class="label">修正海压:</td>
                        <td>{{pres}}hPa</td>
                    </tr>
                    <tr>
                        <td class="label">风速风向:</td>
                        <td>{{wind_spd}}m/s, {{wind_deg}}°</td>
                        <td class="label">降水量:</td>
                        <td>{{pcpn}}mm</td>
                    </tr>
                </table>
            </div>
            <div v-else class="ar-message">
                <header>RJCC 152030Z 16004KT 3200 BR FEW002 SCT003 BKN012 16/16 Q0999=</header>
                <article v-html="messageContent"></article>
            </div>
            <footer>
                <el-button type="text" @click="nowChange">{{nowChangeMessage}}</el-button>
            </footer>


            <div class="ar-head">
                <span>{{messagePre}}</span>
                <span>{{predictTime}}更新</span>
            </div>
            <div class="ar-body" v-if="arPreStatus">
                <el-table :data="tableData">
                    <el-table-column prop="time" label="时间" align="center">
                        <template slot-scope="scope">
                            {{scope.row.time.substring(11,16)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cond_txt" label="天气现象" align="center">
                    </el-table-column>
                    <el-table-column prop="tmp" label="温度" align="center">
                    </el-table-column>
                    <el-table-column prop="pop" label="降水概率" align="center">
                    </el-table-column>
                    <el-table-column prop="wind_spd" label="风速" align="center">
                    </el-table-column>
                </el-table>
            </div>
            <div v-else class="ar-message">
                <header>RJCC 152030Z 16004KT 3200 BR FEW002 SCT003 BKN012 16/16 Q0999=</header>
                <article v-html="messageContent"></article>
            </div>
            <footer>
                <el-button type="text" @click="predictChange">{{predictChangeMessage}}</el-button>
            </footer>
        </div>


        <div v-show="activeIndex=='2'">
            <div class="pre-head">
                更新时间: {{predictTime}}
            </div>
            <!-- <el-button type="primary" @click="drawChart">测试</el-button> -->
            <div class="echart-con" ref="myChart">
            </div>
            <div class="echart-con" ref="myChartPres">
            </div>
            <div class="echart-con" ref="myChartWind">
            </div>
            <div class="echart-con" ref="myChartCloud">
            </div>
        </div>
    </div>
</template>
<script>
    import axios from "axios";
    // import {
    //     messageAnalyse
    // } from "../utils/tool"
    let echarts = require('echarts/lib/echarts')
    require('echarts/lib/chart/line')
    require('echarts/lib/component/tooltip') // tooltip组件
    require('echarts/lib/component/title') //  title组件
    require('echarts/lib/component/legend') // legend组件
    export default {
        data() {
            return {
                realPublishTime: "",
                predictTime: "",
                imgsrc: "100",
                temperature: "",
                cond_txt: "",
                hum: "",
                vis: "",
                wind_deg: "",
                wind_spd: "",
                pres: "",
                cloud: "",
                pcpn: "",
                arStatus: true,
                messageNow: "最新机场实况",
                nowChangeMessage: "机场实况报文",
                messageContent: "<h3>这是一个h3元素内容</h3><h3>这是第二个h3元素内容</h3>",
                messagePre: "未来24小时天气",
                tableData: [],
                predictChangeMessage: "机场预报报文",
                arPreStatus: true,
                activeIndex: '1',
                startTime: ''
            };
        },
        mounted() {
            this.init();
        },
        computed: {},
        methods: {
            drawChart() {
                // console.log("table data is:", this.tableData)
                let tmpArray = [],
                    timeArray = [],
                    dewArray = [],
                    presArray = [],
                    wind_spdArray = [],
                    cloudArray = [];

                for (let i = 0; i < this.tableData.length; i++) {
                    tmpArray.push(this.tableData[i].tmp);
                    timeArray.push(this.tableData[i].time.substring(11, 16));
                    dewArray.push(this.tableData[i].dew);
                    presArray.push(this.tableData[i].pres);
                    wind_spdArray.push(this.tableData[i].wind_spd);
                    cloudArray.push(this.tableData[i].cloud);
                }

                let option = {
                    title: {
                        text: "气温和露点(℃)"
                    },
                    legend: {
                        data: ['气温', '露点温度']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'none'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: timeArray
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    series: [{
                        name: '气温',
                        data: tmpArray,
                        type: 'line',
                        smooth: 'true'
                    }, {
                        name: '露点温度',
                        data: dewArray,
                        type: 'line',
                        smooth: 'true'
                    }]
                }
                let optionString = JSON.stringify(option);
                let optionPres = JSON.parse(optionString)
                optionPres.title.text = "修正海压(hPa)";
                optionPres.legend.data = [];
                optionPres.series = [{
                    name: '修正海压',
                    data: presArray,
                    type: 'line',
                    smooth: 'true'
                }];

                let optionWind = JSON.parse(optionString);
                optionWind.title.text = "风速(m/s)";
                optionWind.legend.data = [];
                optionWind.series = [{
                    name: '风速',
                    data: wind_spdArray,
                    type: 'line',
                    smooth: 'true'
                }];

                let optionCloud = JSON.parse(optionString);
                optionCloud.title.text = "云量(%)";
                optionCloud.legend.data = [];
                optionCloud.series = [{
                    name: '云量',
                    data: cloudArray,
                    type: 'line',
                    smooth: 'true'
                }];

                let myChart = echarts.init(this.$refs.myChart);
                myChart.clear();
                myChart.setOption(option);

                let myChartPres = echarts.init(this.$refs.myChartPres);
                myChartPres.clear();
                myChartPres.setOption(optionPres);

                let myChartWind = echarts.init(this.$refs.myChartWind);
                myChartWind.clear();
                myChartWind.setOption(optionWind);

                let myChartCloud = echarts.init(this.$refs.myChartCloud);
                myChartCloud.clear();
                myChartCloud.setOption(optionCloud);
            },
            handleSelect(key) {
                this.activeIndex = key;
                // this.drawChart();
            },
            nowChange() {
                if (this.nowChangeMessage == "机场实况报文") {
                    this.nowChangeMessage = "返回";
                    this.messageNow = "机场实况报文";
                    this.arStatus = false;
                } else {
                    this.nowChangeMessage = "机场实况报文";
                    this.messageNow = "最新机场实况";
                    this.arStatus = true;
                }
            },
            predictChange() {
                if (this.messagePre == '未来24小时天气') {
                    this.messagePre = '机场预报报文';
                    this.predictChangeMessage = "返回";
                    this.arPreStatus = false;
                } else {
                    this.messagePre = '未来24小时天气';
                    this.predictChangeMessage = "机场预报报文";
                    this.arPreStatus = true;
                }
            },
            init() {
                // RH=10^(（7.45*td）/(235+td))/10^(（7.45*t）/(235+t))
                let location = this.$store.state.location;
                // let location = "40.85952522899319,111.829833984375"
                axios.get(
                        `https://free-api.heweather.net/s6/weather/now?location=${location}&key=354b4fe12c36488f9bd819d8409d5f86`
                    )
                    .then(res => {
                        let data = res.data.HeWeather6[0];
                        console.log(data)
                        let meteoData = data.now;
                        // console.log(data);
                        this.realPublishTime = data.update.loc;
                        // console.log(this.realPublishTime.substring(11, 16));
                        let cond_code = meteoData.cond_code;
                        if (
                            cond_code == "100" ||
                            cond_code == "103" ||
                            cond_code == "104" ||
                            cond_code == "300" ||
                            cond_code == "301" ||
                            cond_code == "406" ||
                            cond_code == "407"
                        ) {
                            if (
                                this.realPublishTime.substring(11, 16) > "20:00" ||
                                this.realPublishTime.substring(11, 16) < "06:00"
                            ) {
                                cond_code = cond_code + "n";
                            }
                        }
                        this.imgsrc = cond_code;
                        this.temperature = meteoData.tmp;
                        this.cloud = meteoData.cloud;
                        this.cond_txt = meteoData.cond_txt;
                        this.hum = meteoData.hum;
                        this.vis = meteoData.vis;
                        this.wind_deg = meteoData.wind_deg;
                        this.wind_spd = meteoData.wind_spd;
                        this.pres = meteoData.pres;
                        this.pcpn = meteoData.pcpn;
                        // this.predictTime = data.predict.publish_time;
                    });

                axios.get(
                    `https://free-api.heweather.net/s6/weather/hourly?location=${location}&key=354b4fe12c36488f9bd819d8409d5f86`
                ).then(res => {
                    console.log(res.data)
                    let data = res.data.HeWeather6[0];
                    this.predictTime = data.update.loc;
                    // let hourlyData = data.hourly;
                    this.tableData = data.hourly;
                })
            }
        }
    };
</script>
<style lang="less">
    .echart-con {
        height: 200px;
        width: 413px;
    }

    .test {
        height: 500px;
        width: 100%;
        background: red;
    }

    .ar-head {
        display: flex;
        height: 40px;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        border-bottom: #128aed solid 1px;

        :first-child {
            color: #128aed;
        }

        :last-child {
            color: #b7b7b8;
            font-size: 12px;
        }
    }

    .ar-body {
        width: 100%;
        font-size: 14px;

        .ar-td {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;

            >div {
                width: 50%;
            }
        }

        td {
            padding: 5px;
            text-align: left;
        }

        .label {
            padding: 0;
            color: #999;
            text-align: right;
            font-size: 12px;
            line-height: 16px;
        }
    }

    .ar-message {
        margin: 5px;
        border: solid 1px #747474;
        color: #666666;
        text-align: left;
        font-size: 12px;

        header {
            background-color: #e7e9ea;
            padding: 5px 10px;
            border-bottom: solid 1px #747474;
        }

        article {
            padding: 5px 10px;
        }
    }

    footer {
        background: #e7e9ea;
        margin: 10px 0;
    }

    .pre-head {
        color: #666666;
        font-size: 12px;
        text-align: left;
        line-height: 15px;
        height: 15px;
        margin: 10px;
    }
</style>