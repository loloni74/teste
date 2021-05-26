export default {
    build: (base_url, searchQuery)=>{
        let finalHtml = base_url
        if (base_url[base_url.length-1] !== '?' ){
            finalHtml+= '?'
        }

        searchQuery.forEach(element =>{
            let search = element[1].toString().replace(' ', '+')

            finalHtml += `${element[0]}=${search}&`
        })
        
        finalHtml = finalHtml.slice(0,finalHtml.length-1)
        return finalHtml
    },
    destroy(fullUrl){
        let url = fullUrl.slice(fullUrl.indexOf('?')+1,fullUrl.length)
        url = url.split('&')
        url = url.map(element =>{
            element = element.split('=')

            let field = element[0]
            let search = element[1]
            return [field,search]
        })
        return url
    },
    objToList(obj){
        let list = []
        for (let x in obj){
            list.push([x,obj[x]])
        }
        return list
    }
} 
