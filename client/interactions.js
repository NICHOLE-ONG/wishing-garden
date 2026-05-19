async function water(id) {
    try{
    await fetch(`/api/wishes/${id}/water`, {
        method: "POST"
    });

    location.reload();
    }
    catch(err){
        console.error('Error reading database')
    }
}