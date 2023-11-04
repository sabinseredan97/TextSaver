This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The app is hosted at https://text-saver.vercel.app

TextSaver is a web app to save notes, there are two sections, books where you can add a book and notes about chapters of that book, and independent notes which are just simple notes that are not related to anything

This is the login page, for now only google signin is avaliable.
![Login Page](image.png)

This is the home page:
![Home Page](image-1.png)

There is also a dark mode functionality:
![Dark mode](image-2.png)

The books and independent notes sections on the navbar are dropdowns:
![Drop down](image-3.png)

Here a independent note can be added:
![ADD independent note](image-4.png)
![Add independent note text](image-5.png)
![Note created](image-6.png)

Here a book can be added: (the verse/s field in optional, it is nullable in the database)
![Add book](image-7.png)
The required fields must be filled to be able to submit the form (this works the same for the independent notes.)
![Fill the required fields](image-8.png)
![Fields filled](image-9.png)
![book added](image-10.png)

This is the see books and independent notes section, it also have pagination, you can choose what number of items to display on a page.
