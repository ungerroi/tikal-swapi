// HELPERS FUNCTIONS
export const getIdFromUrl = url => url.slice(url.lastIndexOf('/', url.lastIndexOf('/')-1) + 1, -1)
export const populate = (arrayOfIds, resource) => {
    return resource.reduce((acc, item) => {
        if (arrayOfIds.includes(getIdFromUrl(item.url))) acc.push(item)
        return acc
    }, [])
}
export const getAllResource = async (resource, page=1, pages=0) => {
    return new Promise( async (res, rej) => { 
        const query = `https://swapi.dev/api/${resource}/?page=${page}&format=json`
        const data = await fetch(query).then($ => $.json())
        if (page === 1) pages = Math.ceil(data.count / data.results.length) 
        res(page < pages
            ? data.results.concat(await getAllResource(resource, page+1, pages))
            : data.results
        )
    })
}