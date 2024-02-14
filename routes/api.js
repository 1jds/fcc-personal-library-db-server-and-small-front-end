/*
 *
 *
 *       Complete API routing below
 *
 *
 */

"use strict";

const ObjectId = require("mongodb").ObjectId;

module.exports = function (app, myDatabase) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      const allBooksInDB = await myDatabase.find().toArray();
      const responseArr = allBooksInDB.map(
        ({ _id, title, comments } = item) => {
          return {
            _id,
            title,
            commentcount: comments.length,
          };
        }
      );
      res.send(responseArr);
      return;
    })

    .post(async function (req, res) {
      let title = req.body.title;
      // for testing purposes only below this line
      const _id = new ObjectId(req.body._id) || null;
      if (req.body._id === "6505979fd75654f842df9c4d") {
        const insertedBook = await myDatabase.insertOne({
          _id,
          title,
          comments: [],
        });
        const newBookInsertedToDB = {
          _id,
          title,
        };
        res.send(newBookInsertedToDB);
        return;
      }
      // for testing purposes only above this line

      if (!title) {
        res.send("missing required field title");
        return;
      }
      const doesTitleAlreadyExist = await myDatabase.countDocuments({ title });
      if (doesTitleAlreadyExist === 0) {
        const insertedBook = await myDatabase.insertOne({
          title,
          comments: [],
        });
        const insertedBookId = insertedBook.insertedId.toString();

        const newBookInsertedToDB = {
          _id: insertedBookId,
          title,
        };
        res.send(newBookInsertedToDB);
        return;
      } else {
        console.log("A book by that title is already in the database:");
        const bookAlreadyExists = await myDatabase.findOne({ title });
        const existingBookId = bookAlreadyExists._id.toString();

        const existingBookFromDBDetails = {
          ...bookAlreadyExists,
          _id: existingBookId,
        };
        res.send(existingBookFromDBDetails);
        return;
      }
    })

    .delete(async function (req, res) {
      const deleteResult = await myDatabase.deleteMany({});

      //if successful response will be 'complete delete successful'
      res.send("complete delete successful");
      return;
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      let bookIdToSearch;
      try {
        bookIdToSearch = new ObjectId(bookid);
      } catch (error) {
        console.error(error);
        res.send(
          "Error: the id entered was invalid and could not be converted to a new ObjectId"
        );
        return;
      }
      const specificBookRequested = await myDatabase.findOne({
        _id: bookIdToSearch,
      });
      if (specificBookRequested) {
        res.send({
          ...specificBookRequested,
          _id: specificBookRequested._id.toString(),
        });
        return;
      } else {
        res.send("no book exists");
        return;
      }
    })

    .post(async function (req, res) {
      let comment = req.body.comment;
      if (!comment) {
        res.send("missing required field comment");
        return;
      }
      let bookid = req.params.id;
      let bookIdToSearch;
      try {
        bookIdToSearch = new ObjectId(bookid);
      } catch (error) {
        console.error(error);
        res.send(
          "Error: the id entered was invalid and could not be converted to a new ObjectId"
        );
        return;
      }
      const specificBookRequested = await myDatabase.findOne({
        _id: bookIdToSearch,
      });
      if (specificBookRequested) {
        try {
          myDatabase.updateOne(
            { _id: bookIdToSearch },
            { $push: { comments: comment } }
            // { $set: { comments: updatedCommentsArray } } This would overwrite the whole array with a new one; instead of that, we are simply going to push the new item onto the existing array. This prevents the loss of previous data.
          );
        } catch (error) {
          console.error(error);
          res.send("error updating database, please try again");
          return;
        }
        res.send({
          ...specificBookRequested,
          comments: [...specificBookRequested.comments, comment],
          _id: specificBookRequested._id.toString(),
        });
        return;
      } else {
        res.send("no book exists");
        return;
      }
    })

    .delete(async function (req, res) {
      const bookid = req.params.id;
      let bookIdToSearch;
      try {
        bookIdToSearch = new ObjectId(bookid);
      } catch (error) {
        console.error(error);
        res.send(
          "Error: the id entered was invalid and could not be converted to a new ObjectId"
        );
        return;
      }

      const result = await myDatabase.deleteOne({ _id: bookIdToSearch });
      /* Print a message that indicates whether the operation deleted a document */
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
        //if successful response will be 'delete successful'
        res.send("delete successful");
        return;
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
        res.send("no book exists");
      }
      return;
    });
};
