import React, { useState } from 'react';

const SelectedBooksForUser = ({me, books}) => {
    let stuffToShow = []

    for (let i = 0; i < books.length; i++) {
        const book = books[i]
        for (let j = 0; j < book.genres.length; j++) {
            let genre = book.genres[j];
            genre = genre.toString().toLowerCase()
            if(genre === me.favoriteGenre.toString().toLowerCase()){
                stuffToShow.push(book)
            }
        }
    }

    return(
    <div>
        <h3>Books selected for you {me.username}</h3>
        {stuffToShow.map(book => <div>{`${book.title} by ${book.author.name} (${book.published})`}</div>)}
    </div>
    )
}

export default SelectedBooksForUser