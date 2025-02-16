export function generateFetchComponent() {
    return {
        setData: (data) => {
            return new Promise((resolve, reject) => {
                fetch("/add", {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(data)
                    })
                    .then(r => r.json())
                    .then(data => resolve(data.result))
                    .catch(err => reject(err.result));
            });
        },
        getData: () => {
            return new Promise((resolve, reject) => {
                fetch("/get")
                    .then(r => r.json())
                    .then(data => resolve(data.result))
                    .catch(err => reject(err.result));
            })
        }
    };
}