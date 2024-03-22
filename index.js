import { input , select } from '@inquirer/prompts';

//จัดเก็บข้อมูลหนังสือ
let book_database = []

//รายการเมนู
async function menu_select(){
    const menu = await select({
        message: 'Select menu',
        choices: [
            { name: 'Add book', value: 'Add book' },
            { name: 'Show book', value: 'Show book' },
            { name: 'Edit book', value: 'Edit book' },
            { name: 'Delete book', value: 'Delete book' },
            { name: 'Exit', value: 'Exit' }
        ]
    });
    if(menu === 'Add book'){
        await add_book()
    }
    else if(menu === 'Show book'){
        show_book()
    }
    else if(menu === 'Edit book'){
        await edit_book()
    }
    else if(menu === 'Delete book'){
        await delete_book()
    }
    else if(menu === 'Exit'){
        return
    }
    await menu_select()
}

//เพิ่มข้อมูลหนังสือ
async function add_book(){

    const name = await input({ 
        message: 'Enter name of book', 
        validate: value => value === '' ? 'Please enter name of book' : true
    });

    const writer = await input({ 
        message: 'Enter writer of book', 
        validate: value => value === '' ? 'Please enter writer of book' : true
    });

    const year = await input({ 
        message: 'Enter year of book', 
        validate: value => (value === '' || isNaN(value)) ? 'Please enter number of year' : (parseInt(value) < 0 ? 'Year must be positive year' : true)
    });

    const price = await input({ 
        message: 'Enter price of book', 
        validate: value => (value === '' || isNaN(value)) ? 'Please enter number of price' : (parseFloat(value) < 0 ? 'Price must be positive price' : true)
    });

    let book = {
        name: name,
        writer: writer,
        year: year,
        price: parseFloat(price)
    };
    book_database.push(book)
    console.log('Book added successfully')
}

//แสดงข้อมูลหนังสือ
function show_book(){
    console.log('Book list')
    console.log('----------------')
    if(book_database.length === 0){
        console.log('No book in database')
        return
    }
    book_database.forEach((book, index) => {
        console.log(`${index + 1}. ${book.name} by ${book.writer} year : (${book.year}) Price : ${book.price} Baht`)
    });
}

//แก้ไขข้อมูลหนังสือ
async function edit_book(){

    //make choice
    const choice_list = []
    book_database.forEach((book, index) => {
        choice_list.push({
            name: `${index + 1}. ${book.name}`,
            value: index.toString()
        })
    });

    //cancel book
    choice_list.push({ name: 'Cancel Edit', value: 'Cancel' });

    //select book by index
    const book_select = await select({ message: 'Select book to edit', choices: choice_list});

    if(book_select === 'Cancel'){
        console.log('Edit canceled')
        return
    }


    //edit book
    const name = await input({
        message: 'Enter name of book', 
        default : book_database[parseInt(book_select)].name,
        validate: value => value === '' ? 'Please enter name of book' : true
    });
    const writer = await input({ 
        message: 'Enter writer of book',
        default : book_database[parseInt(book_select)].writer,
        validate: value => value === '' ? 'Please enter writer of book' : true
    });
    const year = await input({ 
        message: 'Enter year of book',
        default : book_database[parseInt(book_select)].year,
        validate: value => (value === '' || isNaN(value)) ? 'Please enter number of year' : (parseInt(value) < 0 ? 'Year must be positive year' : true)
    });
    
    const price = await input({ 
        message: 'Enter price of book',
        default : book_database[parseInt(book_select)].price,
        validate: value => (value === '' || isNaN(value)) ? 'Please enter number of price' : (parseFloat(value) < 0 ? 'Price must be positive price' : true)
    });


    //update book
    book_database[parseInt(book_select)].name = name
    book_database[parseInt(book_select)].writer = writer
    book_database[parseInt(book_select)].year = year
    book_database[parseInt(book_select)].price = parseFloat(price)
    console.log('Book updated successfully')
}

//ลบข้อมูลหนังสือ
async function delete_book(){

    //make choice
    const choice_list = []
    book_database.forEach((book, index) => {
        choice_list.push({
            name: `${index + 1}. ${book.name}`,
            value: index.toString()
        })
    });

    //select book by index
    const book_select = await select({ message: 'Select book to delete', choices: choice_list });

    //confirm delete
    const confirm = await select({ message: 'Are you sure to delete this book?', choices: [
        { name: 'Yes', value: 'Yes' },
        { name: 'No', value: 'No' }
    ]});

    if(confirm === 'No'){
        console.log('Delete canceled')
        return
    }

    //delete book
    book_database.splice(parseInt(book_select), 1)
    console.log('Book deleted successfully')
}


//เรียกใช้งานเมนู
menu_select()