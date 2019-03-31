new Vue({
    el: '#app',
    data: {
        youtubers: [
            {
                name: 'PewDiePie',
                id: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
                image: 'gfx/pewdiepie.jpg',
                subcount: {
                    current: 0,
                    previous: 0,
                },
            }, {
                name: 'T-Series',
                id: 'UCq-Fj5jknLsUf-MWSy4_brA',
                image: 'gfx/tseries.jpg',
                subcount: {
                    current: 0,
                    previous: 0,
                },
            },
        ],
    },
    created: function () {
        this.getData();

        setInterval(function () {
            this.getData();
        }.bind(this), 1000);
    },
    methods: {
        getData: function () {
            let self = this;
            let url = 'https://www.googleapis.com/youtube/v3/channels';
            let parameters = {
                params: {
                    id: self.getYoutuberIdAsString(),
                    part: 'statistics',
                    key: 'AIzaSyDXXdB_sBm2ENFikZ2Ie0k6G6_loVRsCeg',
                },
            };

            axios.get(url, parameters).then(function (response) {
                let items = response.data.items;
                for (let prop in items) {
                    let item = items[prop];
                    let youtuber = self.findYoutuberById(item.id);
                    youtuber.subcount.previous = youtuber.subcount.current;
                    youtuber.subcount.current = item.statistics.subscriberCount;
                }
            });
        },
        getYoutuberIdAsString: function () {
            let array = [];

            this.youtubers.forEach(function (youtuber) {
                array.push(youtuber.id);
            });

            return array.join();
        },
        getClass: function (youtuber) {
            if (youtuber.subcount.current < youtuber.subcount.previous) {
                return 'red';
            }

            if (youtuber.subcount.current > youtuber.subcount.previous) {
                return 'green';
            }

            return 'gray';
        },
        findYoutuberById: function (id) {
            return this.youtubers.find(function (youtuber) {
                return youtuber.id === id;
            });
        },
        formatNumber: function (number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
});