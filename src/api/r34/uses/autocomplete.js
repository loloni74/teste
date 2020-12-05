const axios = require('axios')
module.exports = async (request) =>{
    var tag = request.query.tag.replace(' ', '_')
    const autocomp = await axios.get(`https://rule34.xxx/autocomplete.php?q=${tag}`)
    return autocomp.data
}