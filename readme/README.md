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

This is the see books and independent notes section, it also have pagination,<br>
you can choose what number of items to display on a page.
![Books list](image-11.png)
Search functionality
![Search](image-12.png)
Limit items displayed on the page
![Limit displayed items](image-13.png)
First page example
![First page](image-14.png)
Second page example
![Second page](image-15.png)
If there isn't data to display a nothing found is shown
![Nothing found](image-16.png)
By pressing the veiw button we can add chapters to the respective book or delete it,<br>
and a list of all the chapters related to that book is displayed
![Book details](image-17.png)
By pressing New Chapter/s and Verse/s we can add more chapters related to the book
![Add ch and vs](image-18.png)
![Added ch and vs](image-19.png)
By pressing View Chpater/s & Verse/s we go to that chapter's page
![Ch and Vs](image-20.png)
Here we can delete the chapter, edit it or add a new note,<br>
also a list of all the notes related to the respective chapter is displayed
<br>

Here is the form to edit the chapter
![Edit ch](image-21.png)
![Edited ch](image-22.png)
![Edited finshed](image-23.png)
![Ch edited](image-24.png)

This is the add note related to the chpater form:
![add ch note](image-25.png)
![Add note](image-26.png)
![Note added](image-27.png)

The new note has been added
![new note added](image-28.png)

By pressing view note we get to that note's page where it can be edited or deleted
![Note page](image-29.png)
![Edited](image-30.png)
![Note edited](image-31.png)

Pressed delete button
![DeleteBtn](image-32.png)
![Note deleted](image-33.png)
The delete functionality is the same for everything
<br>

The profile picture is also a dropdown menu where you can see your account details,<br>
go to the github repo of the project or sing out
![Profile](image-34.png)

This is the profile page
![Profile page](image-35.png)
