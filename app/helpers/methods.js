module.exports = {
    slugify: function(str) {
        str = str.replace(/^\s+|\s+$/g, "");
        str = str.toLowerCase();
        str = str
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        return str;
    },
    changeImageName: function(str) {
        str = str.replace(/^\s+|\s+$/g, "");
        str = str.toLowerCase();
        str = str
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
        var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
        var to = "aaaaaeeeeeiiiiooooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        return str;
    },
    getCollection: async function(ModelName, bodyData) {
        let Model = db[ModelName]

        let filter = { status: 1 }
        let sort = bodyData.sort || { created_at: -1 }

        let limit = 25
        let page = 1

        if ('pagination' in bodyData) {
            const pagination = bodyData['pagination'];
            if ('page_size' in pagination) {
                limit = pagination['page_size'];
            }
            if ('current_page' in pagination) {
                page = pagination['current_page'];
            }
        }

        function getTotalCount() {
            return new Promise((resolve, reject) => {
                Model.find(filter)
                    .countDocuments()
                    .exec()
                    .then((count) => {
                        resolve(count)
                    })
                    .catch((err) => reject(err))
            })
        }

        function getList() {
            return new Promise((resolve, reject) => {
                Model.find(filter)
                    .skip((page - 1) * limit)
                    .sort(sort)
                    .limit(limit)
                    .exec()
                    .then((docs) => {
                        resolve(docs)
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err)
                    })
            })
        }

        return Promise.all([getTotalCount(), getList()]).then(([count, list]) => {
            return {
                code: 'success',
                total: count,
                data: list,
            }
        }).catch((err) => {
            return {
                code: 'error',
                msg: err
            }
        })
    }
}