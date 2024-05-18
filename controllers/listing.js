
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
// const { geocoding } = require("@maptiler/sdk");


module.exports.index= async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (error) {
        
        
        res.status(500).send("Internal Server Error");
    } 
};


module.exports.RenderNewForm = (req, res) => {

    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

const NodeGeocoder = require('node-geocoder');

// Create an instance of the geocoder with your preferred provider (e.g., OpenStreetMap)
const geocoder = NodeGeocoder({
    provider: 'openstreetmap'
});

module.exports.createListing = async (req, res, next) => {
    try {
        let city = req.body.listing.location;

        // Perform geocoding to get latitude and longitude
        let response = await geocoder.geocode(city);
        
        // Extract latitude and longitude from the first result
        let { latitude, longitude } = response[0];

        // Create a new listing object with all the required fields
        const newListing = new Listing({
            title: req.body.listing.title,
            description: req.body.listing.description,
            image: {
                url: req.file.path,
                filename: req.file.filename
            },
            price: req.body.listing.price,
            location: req.body.listing.location,
            country: req.body.listing.country,
            owner: req.user._id,
            geometry: {
                type: "Point",
                coordinates: [longitude, latitude] // Longitude first, then latitude
            }
        });

        // Save the new listing to the database
       let test= await newListing.save();
      
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        
        req.flash("error", "Failed to create listing.");
        res.redirect("/listings");
    }
};

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/uploads","/uploads/w_250");
    res.render("listings/edit.ejs", { listing ,originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    try {
        // Extract city from the request body
        let city = req.body.listing.location;
        
        // Perform geocoding to get latitude and longitude
        let response = await geocoder.geocode(city);
        
        // Extract latitude and longitude from the first result
        let { latitude, longitude } = response[0];
        
        // Find the listing by ID and update it with the new data
        let { id } = req.params;
        let listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }
        
        // Update listing fields
        listing.title = req.body.listing.title;
        listing.description = req.body.listing.description;
        listing.price = req.body.listing.price;
        listing.location = req.body.listing.location;
        listing.country = req.body.listing.country;
        listing.geometry = {
            type: "Point",
            coordinates: [longitude, latitude] // Longitude first, then latitude
        };
        
        // If a new image file is uploaded, update the image field
        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        
        // Save the updated listing
        await listing.save();
        
        // Flash success message and redirect to the updated listing page
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to update listing.");
        res.redirect("/listings");
    }
};


module.exports.distroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("sucess","Listings Deleted!");

    res.redirect("/listings");
};