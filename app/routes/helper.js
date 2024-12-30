const express = require('express');
const app = express();

app.post("/search", async function(req, res) {
    let keyword = req.query.q
    let products = []
    if (keyword) {
        products = await db.product.find({ name: { $regex: keyword, $options: "i" } }, 'image price slug name ').limit(16)
    }

    return res.json({ success: true, products })
})

app.get("/home", async function(req, res) {
    let childCatRuuVang = await db.catalog.find({ parent: '634ad6e5507648b6b3be5e4f' }, '_id')
    let childCatRuuManh = await db.catalog.find({ parent: '634ad7b1baa4749ee570188d' }, '_id')
    let childCatWisky = await db.catalog.find({ parent: '634d86c088bf68a5d852eb8b' }, '_id')

    let ruuVang = await db.product.find({ status: 1, catalogs: { $in: childCatRuuVang } }).sort({ createdAt: -1 }).select('image name price.regular price.sale slug').limit(8)
    let ruuWisky = await db.product.find({ status: 1, catalogs: { $in: childCatWisky } }).sort({ createdAt: -1 }).select('image name price.regular price.sale slug').limit(8)
    let ruuManh = await db.product.find({ status: 1, catalogs: { $in: childCatRuuManh } }).sort({ createdAt: -1 }).select('image name price.regular price.sale slug').limit(8)
    let top = await db.product.find({ status: 1, featured: true }, 'image name price.regular price.sale slug').limit(8)
    let articleNews = await db.post.find({ status: 1 }, 'image title description slug content').sort({ createdAt: -1 }).limit(4)
    let sliders = await db.slider.find({ status: 1 }, 'image url').sort({ createdAt: -1 }).limit(4)
    let express = await db.logo.find({ status: 1, type: 1 }, 'title image url').sort({ createdAt: -1 })
    let rs = {
        sliders: sliders,
        sections: [{
                title: '<h1 class="text-primary title-section text-center">TOP RƯỢU VANG</h1>',
                items: top.map(item => {
                    item.price = item.price.regular
                    return item
                })
            },
            {
                title: '<h2 class="text-primary title-section text-center">RƯỢU VANG NGON</h2>',
                items: ruuVang.map(item => {
                    item.price = item.price.regular
                    return item
                })
            },
            {
                title: '<h2 class="text-primary title-section text-center">RƯỢU WHISKY</h2>',
                items: ruuWisky.map(item => {
                    item.price = item.price.regular
                    return item
                })
            },
            {
                title: '<h2 class="text-primary title-section text-center">RƯỢU MẠNH</h2>',
                items: ruuManh.map(item => {
                    item.price = item.price.regular
                    return item
                })
            },
            {
                section_type: 'article_list',
                title: '<h3 class="text-primary title-section text-center">CHIA SẺ VỀ RƯỢU</h3>',
                items: articleNews
            }
        ],
        express: express,
    }

    rs.sections = rs.sections.filter(item => item.items.length)
    res.json(rs)
})

app.get("/init", async function(req, res) {
    let rs = {
        success: true,
        navs: navs,
        settings: settings
    }

    return res.json(rs)
})

module.exports = app;

const settings = {
    phone: '0986583722',
    meta_description: 'Wine Lux là cửa hàng rượu vang Đà Nẵng cung cấp các dòng rượu vang nhập khẩu chính hãng với giá thành tốt nhất',
    meta_title: 'Cửa Hàng Rượu Vang Chính Hãng - Rượu Đà Nẵng - Wine Lux',
    meta_keyword: '',
    bank_number: '9868868468',
    bank_user_name: 'Trần Đức Anh',
    bank_name: 'Vietcombank',
    address: '227B Nguyễn Công Trứ, An Hải Bắc, Sơn Trà, Đà Nẵng',
    email: 'hi@winelux.vn'
}

const navs = [{
        _id: 1,
        name: 'Trang chủ',
        slug: '/'
    },
    {
        _id: 2,
        name: 'Rượu vang',
        slug: '/ruou-vang',
        children: [{
                _id: 21,
                name: 'Rượu vang đỏ',
                slug: '/ruou-vang-do',
            },
            {
                _id: 22,
                name: 'Rượu vang trắng',
                slug: '/ruou-vang-trang',
            },
            {
                _id: 23,
                name: 'Rượu vang hồng',
                slug: '/ruou-vang-hong',
            },
            {
                _id: 24,
                name: 'Sparkling',
                slug: '/sparkling',
            },
            {
                _id: 24,
                name: 'Champagne',
                slug: '/champagne',
            }
        ]
    },
    {
        _id: 3,
        name: 'Whisky',
        slug: '/whisky',
        children: [{
                _id: 31,
                name: 'Single Malt Whisky',
                slug: '/single-malt-whisky',
            },
            {
                _id: 32,
                name: 'Blended Whisky',
                slug: '/blended-whisky',
            },
            {
                _id: 32,
                name: 'Blended Malt',
                slug: '/blended-malt',
            },
            {
                _id: 32,
                name: 'Grain Whisky',
                slug: '/grain-whisky',
            }
        ]
    },
    {
        _id: 3,
        name: 'Rượu mạnh',
        slug: '/ruou-manh',
        children: [{
                _id: 31,
                name: 'Vodka',
                slug: '/vodka',
            },
            {
                _id: 32,
                name: 'Gin',
                slug: '/gin',
            },
            {
                _id: 32,
                name: 'Rum',
                slug: '/rum',
            },
            {
                _id: 32,
                name: 'Soju',
                slug: '/soju',
            }
        ]
    },
    {
        _id: 4,
        name: 'Cigar',
        slug: '/cigar',
    },
    {
        _id: 5,
        name: 'Phụ kiện',
        slug: '/phu-kien',
        children: [{
                _id: 51,
                name: 'Ly rượu vang',
                slug: '/ly-ruou-vang',
            },
            {
                _id: 52,
                name: 'Ly rượu mạnh',
                slug: '/ly-ruou-manh',
            },
            {
                _id: 53,
                name: 'Khui rượu',
                slug: '/khui-ruou',
            },
            {
                _id: 54,
                name: 'Decanter',
                slug: '/decanter',
            },
            {
                _id: 55,
                name: 'Tủ rượu',
                slug: '/tu-ruou',
            }
        ]
    },
    {
        _id: 6,
        name: 'Quà tặng',
        slug: '/qua-tang',
    },
    {
        _id: 6,
        name: 'Bài viết',
        slug: '/bai-viet',
        children: [{
                _id: 31,
                name: 'Chia sẻ',
                slug: '/chia-se',
            },
            {
                _id: 32,
                name: 'Hướng dẫn',
                slug: '/huong-dan',
            },
            {
                _id: 33,
                name: 'Khuyến mãi',
                slug: '/khuyen-mai',
            },
            {
                _id: 34,
                name: 'Tin tức',
                slug: '/tin-tuc',
            }
        ]
    }
]