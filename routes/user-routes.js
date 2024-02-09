// const {
//   getAllUsers,
// } = require("../controllers/all-Users/all-users-controller");
// const { getUser } = require("../controllers/all-Users/singleUser-controller");
const {
  getAllJobSeekers,
  getJobSeekersBySkills,
  getJobSeekersByName,
  getJobSeekersByParams
} = require("../controllers/jobseekersCTRL");
const {
  getAllEmployers,
  searchEmployers,
} = require("../controllers/employersCTRL");
const {
  AddToFavorite,
  RemoveFromFavorite,
  GetFavoriteUser,
  GetAllFavoriteUsers
} = require("../controllers/favoriteCTRL");
const authMiddleware = require("../middleware/auth-middleware");
const { getAllUsers, getUser, showCurrentUser, updateUserNumber, updateUserPassword, updateUserEmail, updateJobSeekerProfile, updateEmployerProfile } = require("../controllers/userCTRL");
// const { showCurrentUser } = require("../controllers/all-Users/current-user");
// const {
//   updateUser,
//   updateUserPassword,
// } = require("../controllers/all-Users/update-user");


const router = require("express").Router();

router.route("/allUsers").get(authMiddleware, getAllUsers); // ALL USERS
router.route("/allUsers/:id").get(authMiddleware, getUser); // GET A SINGLE USER BY ID
router.route("/currentUser").get(authMiddleware, showCurrentUser); // showCurrentUser
router.route("/getAllJobSeekers").get(authMiddleware, getAllJobSeekers); // ALL JOB SEEKERS

router.route("/searchJobSeekers").get(authMiddleware, getJobSeekersBySkills); // Search JOB SEEKERS By skill
router.route("/getJobSeekersByName").get(authMiddleware, getJobSeekersByName); // Search JOB SEEKERS By name
router.route("/searchJobseekersParams").get(authMiddleware, getJobSeekersByParams); // Search JOB SEEKERS By name

router.route("/getAllEmployers").get(authMiddleware, getAllEmployers); // ALL EMPLOYERS
router.route("/searchEmployers").get(authMiddleware, searchEmployers); // Search Employers By companies
router.route("/updateUserNumber").patch(authMiddleware, updateUserNumber); // updateUserNumber
router.route("/updateUserEmail").patch(authMiddleware, updateUserEmail); // updateUserEmail
router.route("/updatePassword").patch(authMiddleware, updateUserPassword); // updateUser
router.route("/updateJobSeekerProfile").put(authMiddleware, updateJobSeekerProfile); // updateUser
router.route("/updateEmployerProfile").put(authMiddleware, updateEmployerProfile); // updateUser

router
  .route("/favorites/:favoriteId")
  .post(authMiddleware, AddToFavorite); // Add to favorite

router.route("/getMyFavorite/:favoriteId").get(authMiddleware, GetFavoriteUser); // ALL EMPLOYERS
router
  .route("/removeFromFavorite/:favoriteId")
  .delete(authMiddleware, RemoveFromFavorite); // ALL EMPLOYERS
router
  .route("/getAllMyFavorites")
  .get(authMiddleware, GetAllFavoriteUsers); // ALL EMPLOYERS
module.exports = router;




