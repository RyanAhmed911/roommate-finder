const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (loading) return

    if (!location || !rent || !capacity || !floor || !area) {
        alert("Please fill up all Room Details fields.")
        return
    }

    setLoading(true)

    // Convert comma-separated strings to arrays
    const hobbiesArray = hobbies.split(',').map(h => h.trim()).filter(h => h)
    const medicalArray = medicalConditions.split(',').map(m => m.trim()).filter(m => m)

    try {
        const payload = {
            location,
            rent: Number(rent),
            capacity: Number(capacity),
            floor: Number(floor),
            area: Number(area),
            balcony,
            attachedBathroom,
            // Add all preference fields
            personalityType,
            hobbies: hobbiesArray,
            foodHabits,
            sleepSchedule,
            cleanlinessLevel,
            noiseTolerance,
            medicalConditions: medicalArray,
            smoker,
            drinking,
            visitors,
            petsAllowed
        }

        const res = await api.post('/room/create', payload)

        if (res.data?.success) {
            alert('Room posted successfully!')
            navigate('/rooms')
        } else {
            alert(res.data?.message || 'Failed to post room')
        }
    } catch (err) {
        console.error(err)
        const msg =
            err?.response?.data?.message ||
            err?.message ||
            'Network error while posting room'
        alert(msg)
    } finally {
        setLoading(false)
    }
}