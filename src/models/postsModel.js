class post{
    constructor(obj){
        this.id = obj.id
        this.extension = obj.extension
        this.score = obj.score
        this.file_height = obj.file_height
        this.file_width = obj.file_width
        this.file_url = obj.file_url
        this.sample_url = obj.sample_url
        this.preview_url = obj.preview_url
        this.tags = obj.tags
        this.source = obj.source
    }
}

module.exports = {
    r34Creator(apiData) {
        let posts = []

        // If any error happen
        if (!apiData){
            posts.push(new post({
                id : "error",
                extension: "error",
                score : "error",
                file_height: "error",
                file_width: "error",
                file_url: "content/error.png",
                sample_url:  "content/error.png",
                preview_url:  "content/error.png",
                source: "error"
            }))
            return posts
        }

        // If it returns just one thing
        if (!Array.isArray(apiData)){
            apiData = [apiData]
        }

        // And the main event
        apiData.forEach(element => {
            let ext = element.file_url.split('.')
            ext = ext[ext.length -1]

            
            let file_url = element.file_url
            if (ext === 'webm' || ext === 'mp4'){
                file_url = file_url.replace('https://us.','https://ny3webm.')
            } 

            posts.push(new post({
                id : element.id,
                extension: ext,
                score : element.score,
                file_height: element.height,
                file_width: element.width,
                file_url: file_url,
                sample_url: element.sample_url,
                preview_url: element.preview_url,
                tags: element.tags,
                source: element.source
            }))
        });
        return posts
    }
}