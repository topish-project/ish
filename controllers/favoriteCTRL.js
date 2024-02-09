const { Users } = require("../models/users");
const { handleResponse } = require("../utils/handleResponse");

class FavoriteCTRL {
    async AddToFavorite(req, res, next) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            if (req.user.role === "JobSeeker") {
                return handleResponse(res, 400, 'error', "JobSeeker can't add to favorites", {}, 0);
            }

            const currentUser = await Users.findById(req.user.id);

            const favoriteId = req.params.favoriteId;
            const favoriteUser = await Users.findById(favoriteId);

            if (!favoriteUser) {
                return handleResponse(res, 404, 'error', 'User not found', {}, 0);
            }

            if (currentUser.favorites.includes(favoriteUser._id)) {
                return handleResponse(res, 400, 'error', 'User already in favorites', {}, 0);
            }

            currentUser.favorites.push(favoriteUser._id);
            await currentUser.save();

            return handleResponse(res, 200, 'success', 'User added to favorites', { message: "User added to favorites" }, 1);
        } catch (error) {
            console.error("Error in AddToFavorite function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }



    async GetFavoriteUser(req, res, next) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const currentUser = await Users.findById(req.user.id).populate('favorites');
            if (!currentUser.favorites || currentUser.favorites.length === 0) {
                return handleResponse(res, 200, 'success', 'Your favorite users basket is empty', {}, 0);
            }
            // If favoriteId is provided in the request, find and return the specific favorite user
            const favoriteId = req.params.favoriteId;
            if (favoriteId) {
                const favoriteUser = currentUser.favorites.find(favorite => favorite._id.toString() === favoriteId);

                if (!favoriteUser) {
                    return handleResponse(res, 404, 'error', 'Favorite user not found in your favorites', {}, 0);
                }
                return handleResponse(res, 200, 'success', 'Favorite user retrieved successfully', { favoriteUser }, 1);
            } else {
                return handleResponse(res, 404, 'error', 'Favorite user not found in your favorites', {}, 0);
            }
        } catch (error) {
            console.error("Error in GetFavoriteUser function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }
    async RemoveFromFavorite(req, res, next) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            if (req.user.role === "JobSeeker") {
                return handleResponse(res, 400, 'error', "JobSeeker can't add to favorite", {}, 0);
            }

            const currentUser = await Users.findById(req.user.id);
            const favoriteId = req.params.favoriteId;

            if (!currentUser.favorites.includes(favoriteId)) {
                return handleResponse(res, 404, 'error', "User not found in favorites", {}, 0);
            }

            currentUser.favorites = currentUser.favorites.filter(
                (userId) => userId.toString() !== favoriteId
            );

            await currentUser.save();

            return handleResponse(res, 200, 'success', "User removed from favorites", {}, 0);
        } catch (error) {
            console.error("Error in RemoveFromFavorite function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }
    async GetAllFavoriteUsers(req, res, next) {
        try {
            // Check if the user is authenticated
            if (!req.user || !req.user.id) {
                return handleResponse(res, 401, 'error', "Unauthorized! Missing user ID.", {}, 0);
            }

            // Retrieve the user and populate the 'favorites' field
            const user = await Users.findById(req.user.id).populate('favorites');

            // Check if the user has favorites
            if (!user.favorites || user.favorites.length === 0) {
                return handleResponse(res, 404, 'success', "Your favorites list is empty.", { favoriteUsers: [] }, 0);
            }

            // Send the list of favorite users
            return handleResponse(res, 200, 'success', "Favorite users retrieved successfully.", { favoriteUsers: user.favorites }, user.favorites.length);
        } catch (error) {
            console.error("Error in GetAllFavoriteUsers function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }
}

module.exports = new FavoriteCTRL();


