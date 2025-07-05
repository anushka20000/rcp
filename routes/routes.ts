import { Router } from "express"
import { jwtAuthMiddleware } from "../middleware/jwt-auth"; //to secure routes
import { categoryList, categorySave, categoryEdit, categoryUpdate, categoryDestroy } from "../controllers/CategoryController"
import { destroyUser, editProfile, editProfileAdmin, editUser, getUser, getUserById, listingProfileAddress, listingUser, saveUser, updateUser } from "../controllers/UserController";
import { magazineSubmissionList, magazineSubmissionSave, magazineSubmissionEdit, magazineSubmissionUpdate, magazineSubmissionDestroy } from "../controllers/MagazineSubmissionController";
import { cmsList, cmsSave, cmsEdit, cmsUpdate, cmsDestroy, cmsDetails, cmsListById, seo } from "../controllers/CmsController";
import { addAddress, destroyUserAddress, getUserAddress, listingAddress, saveUserAddress, updateUserAddress, addUserAddressToCart, removeAddresses } from "../controllers/UserAddressController";
import { samagriList, samagriSave, samagriEdit, samagriUpdate, samagriDestroy } from "../controllers/SamagriController";
import { destroyLocation, editLocation, locationList, saveLocation, updateLocation } from "../controllers/LocationController";
import { login, verifyOTP, adminLogin, findUserByEmail, findUserByEmailAdmin, findUserByPhoneAdmin } from "../controllers/AuthController";
import { pujaList, pujaSave, pujaEdit, pujaDestroy, pujaUpdate, pujaFrontendAPI, pujaDetails, pujaListing, pujaSeo } from "../controllers/PujaController";
import { packageList, packageSave, packageEdit, packageUpdate, packageDestroy, listingPackage, pujaPackages, packageListByPujaId } from "../controllers/PackageController";
import { orderSave, orderEdit, orderUpdate, orderDestroy, orders, orderDetails, orderDetailsAdmin, removeCarts, addToOrder, verifyOrder, orderDetailItem, downloadInvoice, allorderList } from "../controllers/OrderController";
import { orderList, orderInfoInDashboard, userReport, orderReport, chartDetails, saleReport } from "../controllers/ReportController";
import { destroyPujaKit, pujaKitList, pujaKitEdit, savePujaKit, updatePujaKit, pujaKitListing, pujaKitDetail, pujaKitSeo } from "../controllers/PujaKitController";
import { samagriPackageList, samagriPackageSave, samagriPackageEdit, samagriPackageUpdate, samagriPackageDestroy, packageListByPujaKitId } from "../controllers/SamagriPackageController";
import { astrologyProductList, astrologyProductSave, astrologyProductEdit, astrologyProductUpdate, astrologyProductDestroy, astrologyProductListing, astrologyProductDetail, astrologyProductDetailSeo } from "../controllers/AstrologyProductController";
import { magazineList, magazineSave, magazineEdit, magazineUpdate, magazineDestroy, magazineListing } from "../controllers/MagazineController";
import { readSubscription, saveSubscription, updateSubscription, destroySubscription, subscriptionEdit } from "../controllers/SubscriptionController";
import { createJoineeDetail, createMeetingDetail, destroyLive, findJoineeDetailByAttendeeId, findJoineeDetailByMeetingId, findJoineeDetailByPujaId, findMeetingDetailByMeetingId, findMeetingDetailByPujaId, getLive, livePuja, saveLive, updateLive } from "../controllers/LiveController";
import { bookingSave, bookingEdit, bookingUpdate, bookingDestroy, getCartDetails, addToCart, removeFromCart, removeItemsCart } from "../controllers/BookingController";
import { destroyLabel, label, labelEdit, readLabel, saveLabel, updateLabel } from "../controllers/LabelController";
import { destroyTour, editTour, readTour, saveTour, tourDetail, tourListing, updateTour, tourDetailSeo } from "../controllers/TourController";
import { homeListing } from "../controllers/HomeController";
import {settingDetails, settingEdit, settingUpdate } from "../controllers/SettingController";
import { addAttendee, createMeeting } from "../controllers/LiveController";
import { contactList, contactListById, contactSave, contactUpdate, destroyContact } from "../controllers/ContactController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";
import { languageDestroy, languageEdit, languageList, languageSave, languageUpdate } from "../controllers/LanguageController";
import { panditDestroy, panditEdit, panditList, panditListing, panditSave, panditUpdate } from "../controllers/PanditController";
import { typeDestroy, typeEdit, typeList, typeLists, typeSave, typeUpdate } from "../controllers/TypeController";

const router = Router();

//Auth
router.post("/v1/login", login);
router.post("/v1/verify-otp", verifyOTP);
router.get("/v1/invoice/:id/:locale?", downloadInvoice);


//Admin Auth
router.post("/admin/login", adminLogin);
router.get("/admin/user/:email", findUserByEmail);
router.put("/admin/profile/update", adminAuthMiddleware, editProfile);
router.put("/admin/profile/edit", adminAuthMiddleware, editProfileAdmin);

//user Route
router.get("/admin/user",adminAuthMiddleware, adminAuthMiddleware, getUser);
router.get("/admin/user/edit/:id",adminAuthMiddleware, getUserById);
router.post("/admin/user/store",adminAuthMiddleware, saveUser);
router.put("/admin/user/update",adminAuthMiddleware, updateUser);
router.delete("/admin/user/delete/:id",adminAuthMiddleware, destroyUser);
router.get("/admin/user-by-email/:email", findUserByEmailAdmin);
router.get("/admin/user-by-phone/:phone", findUserByPhoneAdmin);

//user add Route
router.post("/admin/user-address/store", adminAuthMiddleware, saveUserAddress);
router.get("/admin/user-address", adminAuthMiddleware, getUserAddress);
router.put("/admin/user-address/update/:id", adminAuthMiddleware, updateUserAddress);
router.delete("/admin/user-address/delete/:id", adminAuthMiddleware, destroyUserAddress);

//category Route
router.get("/admin/category", adminAuthMiddleware, categoryList);
router.post("/admin/category/store", adminAuthMiddleware, categorySave);
router.get("/admin/category/edit/:id", adminAuthMiddleware, categoryEdit);
router.put("/admin/category/update/:id", adminAuthMiddleware, categoryUpdate);
router.delete("/admin/category/delete/:id", adminAuthMiddleware, categoryDestroy);

//language Route
router.get("/admin/language",  adminAuthMiddleware, languageList);
router.post("/admin/language/store", adminAuthMiddleware, languageSave);
router.get("/admin/language/edit/:id", adminAuthMiddleware, languageEdit);
router.put("/admin/language/update/:id", adminAuthMiddleware, languageUpdate);
router.delete("/admin/language/delete/:id", adminAuthMiddleware, languageDestroy);

//pandit Route
router.get("/admin/pandit", adminAuthMiddleware, panditList);
router.post("/admin/pandit/store", adminAuthMiddleware, panditSave);
router.get("/admin/pandit/edit/:id", adminAuthMiddleware, panditEdit);
router.put("/admin/pandit/update", adminAuthMiddleware, panditUpdate);
router.delete("/admin/pandit/delete/:id", adminAuthMiddleware, panditDestroy);


//samagri Route
router.get("/admin/samagri", adminAuthMiddleware, samagriList);
router.post("/admin/samagri/store", adminAuthMiddleware, samagriSave);
router.get("/admin/samagri/edit/:id", adminAuthMiddleware, samagriEdit);
router.put("/admin/samagri/update", adminAuthMiddleware, samagriUpdate);
router.delete("/admin/samagri/delete/:id", adminAuthMiddleware, samagriDestroy);
// router.get("/samagri-listing/:locale/:slug", listingPujaSamagri);

//booking Route
router.post("/admin/booking/store", adminAuthMiddleware, bookingSave);
router.get("/admin/booking/edit/:id", adminAuthMiddleware, bookingEdit);
router.put("/admin/booking/update/:id", adminAuthMiddleware, bookingUpdate);
router.delete("/admin/booking/delete/:id", adminAuthMiddleware, bookingDestroy);

//pujakit Route
router.get("/admin/puja-kit", adminAuthMiddleware, pujaKitList)
router.post("/admin/puja-kit/store", adminAuthMiddleware, savePujaKit);
router.get("/admin/puja-kit/edit/:id", adminAuthMiddleware, pujaKitEdit);
router.put("/admin/puja-kit/update", adminAuthMiddleware, updatePujaKit);
router.delete("/admin/puja-kit/delete/:id", adminAuthMiddleware, destroyPujaKit);
//router.get("/puja-kit-listing/:locale/:slug", listingPujakit);

//samagri-package Route
router.get("/admin/samagri-package", adminAuthMiddleware, samagriPackageList);
router.get("/admin/samagri-package/package/:puja_kit_id", adminAuthMiddleware, packageListByPujaKitId);
router.post("/admin/samagri-package/store", adminAuthMiddleware, samagriPackageSave);
router.get("/admin/samagri-package/edit/:id", adminAuthMiddleware, samagriPackageEdit);
router.put("/admin/samagri-package/update", adminAuthMiddleware, samagriPackageUpdate);
router.delete("/admin/samagri-package/delete/:id", adminAuthMiddleware, samagriPackageDestroy);

//live Route
router.post("/live/store", saveLive);
router.get("/live", getLive);
router.get("/admin/live-puja", adminAuthMiddleware, livePuja);
router.put("/live/update/:id", updateLive);
router.delete("/live/delete/:id", destroyLive);

//Magazine Submission
router.get("/admin/magazine-submission", adminAuthMiddleware, magazineSubmissionList);
// router.post("/admin/magazine-submission/store", magazineSubmissionSave);
router.get("/admin/magazine-submission/edit/:id", adminAuthMiddleware, magazineSubmissionEdit);
router.put("/admin/magazine-submission/update", adminAuthMiddleware, magazineSubmissionUpdate);
router.delete("/admin/magazine-submission/delete/:id", adminAuthMiddleware, magazineSubmissionDestroy);
//CMS
router.get("/admin/cms", adminAuthMiddleware, cmsList);
router.get("/admin/cms/:id", adminAuthMiddleware, cmsListById);
router.post("/admin/cms/store", adminAuthMiddleware, cmsSave);
router.get("/admin/cms/edit/:id", adminAuthMiddleware, cmsEdit);
router.put("/admin/cms/update", adminAuthMiddleware, cmsUpdate);
router.delete("/admin/cms/delete/:id", adminAuthMiddleware, cmsDestroy);

//Location
router.get("/admin/location", adminAuthMiddleware, locationList);//
router.post("/admin/location/store", adminAuthMiddleware, saveLocation);
router.get("/admin/cms/edit/:id", adminAuthMiddleware, editLocation);
router.get("/admin/location/edit/:id", adminAuthMiddleware, editLocation);
router.put("/admin/location/update/:id", adminAuthMiddleware, updateLocation);
router.delete("/admin/location/delete/:id", adminAuthMiddleware, destroyLocation);

//Puja
router.get("/admin/puja", adminAuthMiddleware, pujaList);
router.post("/admin/puja/store", adminAuthMiddleware, pujaSave);
router.get("/admin/puja/edit/:id", adminAuthMiddleware, pujaEdit);
router.put("/admin/puja/update", adminAuthMiddleware, pujaUpdate);
router.delete("/admin/puja/delete/:id", adminAuthMiddleware, pujaDestroy);

//Package
router.get("/admin/package", adminAuthMiddleware, packageList);
router.get("/admin/puja/package/:puja_id", adminAuthMiddleware, packageListByPujaId);
router.post("/admin/package/store", adminAuthMiddleware, adminAuthMiddleware, packageSave);
router.get("/admin/package/edit/:id", adminAuthMiddleware, packageEdit);
router.put("/admin/package/update", adminAuthMiddleware, packageUpdate);
router.delete("/admin/package/delete/:id", adminAuthMiddleware, packageDestroy);

// Order
router.get("/admin/order/:type", adminAuthMiddleware, orderList);
router.get("/admin/order", adminAuthMiddleware, allorderList);
router.get("/admin/order-info-in-dashboard", orderInfoInDashboard);//adminAuthMiddleware
router.post("/admin/order/store", adminAuthMiddleware, orderSave);
router.get("/admin/order/edit/:id", adminAuthMiddleware, orderEdit);
router.put("/admin/order/update/", adminAuthMiddleware, orderUpdate);
router.delete("/admin/order/delete/:id", adminAuthMiddleware, orderDestroy);
router.get("/admin/order-details/:id/:locale?", adminAuthMiddleware, orderDetailsAdmin);//jwtAuthMiddleware
router.get("/admin/chart-details", chartDetails);//jwtAuthMiddleware
router.get("/admin/sale-details", saleReport);//jwtAuthMiddleware

//report
router.get("/admin/user-report", userReport);
router.get("/admin/order-report", orderReport);

//user
router.get("/admin/users", adminAuthMiddleware, getUser);

// Astrology Product
router.get("/admin/astrology-product", adminAuthMiddleware, astrologyProductList);
router.post("/admin/astrology-product/store", adminAuthMiddleware, astrologyProductSave);
router.get("/admin/astrology-product/edit/:id", adminAuthMiddleware, astrologyProductEdit);
router.put("/admin/astrology-product/update", adminAuthMiddleware, astrologyProductUpdate);
router.delete("/admin/astrology-product/delete/:id", adminAuthMiddleware, astrologyProductDestroy);

//Magazine
router.get("/admin/magazine", adminAuthMiddleware, magazineList);
router.post("/admin/magazine/store", adminAuthMiddleware, magazineSave);
router.get("/admin/magazine/edit/:id", adminAuthMiddleware, magazineEdit);
router.put("/admin/magazine/update", adminAuthMiddleware, magazineUpdate);
router.delete("/admin/magazine/delete/:id", adminAuthMiddleware, magazineDestroy);

//Subscription
router.get("/admin/subscription", adminAuthMiddleware, readSubscription);
// router.post("/admin/subscription/store", saveSubscription);
router.get("/admin/subscription/edit/:id", adminAuthMiddleware, subscriptionEdit);
router.put("/admin/subscription/update", adminAuthMiddleware, updateSubscription);
router.delete("/admin/subscription/delete/:id", adminAuthMiddleware, destroySubscription);

//Label
router.get("/admin/label", adminAuthMiddleware, readLabel);
router.get("/admin/label/edit/:id", adminAuthMiddleware, labelEdit);
router.post("/admin/label/store", adminAuthMiddleware, saveLabel);
router.put("/admin/label/update", adminAuthMiddleware, updateLabel);
router.delete("/admin/label/delete/:id", adminAuthMiddleware, destroyLabel);

//Tour
router.get("/admin/tour", adminAuthMiddleware, readTour);
router.post("/admin/tour/store", adminAuthMiddleware, saveTour);
router.get("/admin/tour/edit/:id", adminAuthMiddleware, editTour);
router.put("/admin/tour/update", adminAuthMiddleware, updateTour);
router.delete("/admin/tour/delete/:id", adminAuthMiddleware, destroyTour);

//Contact
router.post("/admin/contact/store", adminAuthMiddleware, contactSave);
router.get("/admin/contact", adminAuthMiddleware, contactList);
router.get("/admin/contact/edit/:id", adminAuthMiddleware, contactListById);
router.put("/admin/contact/update", adminAuthMiddleware, contactUpdate);
router.delete("/admin/contact/delete/:id", adminAuthMiddleware, destroyContact);

//setting

router.get("/admin/setting/edit/:id", adminAuthMiddleware, settingEdit);
router.put("/admin/setting/update", adminAuthMiddleware, settingUpdate);
//magazine type

router.get("/admin/type", adminAuthMiddleware, typeList);
router.post("/admin/type/store", adminAuthMiddleware, typeSave);
router.get("/admin/type/edit/:id", adminAuthMiddleware, typeEdit);
router.put("/admin/type/update", adminAuthMiddleware, typeUpdate);
router.delete("/admin/type/delete/:id", adminAuthMiddleware, typeDestroy);

// FRONTEND (WEB)

router.get("/v1/online-booking-puja/:slug/:locale", pujaFrontendAPI);
router.get("/v1/package/:locale/:slug/:on_site/:location_id/:date", listingPackage);

// user registration
router.post("/v1/user/register", saveUser);
router.get("/v1/profile-info", jwtAuthMiddleware, listingUser);
router.put("/v1/profile-info/update", jwtAuthMiddleware, editUser);
router.get("/v1/profile-info/address", jwtAuthMiddleware, listingProfileAddress);

//Label
router.get("/v1/labels", label);

//Home
router.get("/v1/home/:locale?", homeListing);

//new puja front end api
router.get("/v1/pujas/:locale?", pujaListing);
router.get("/v1/puja/:slug/:locale?", pujaDetails);
router.get("/v1/puja-packages/:slug/:locale?", pujaPackages);
router.get("/v1/puja-seo/:slug", pujaSeo);

//pandit
router.get("/v1/pandit/:locale?", panditListing);

//Astrology product
router.get("/v1/astrologies/:locale?", astrologyProductListing);
router.get("/v1/astrology-product/:slug/:locale?", astrologyProductDetail);
router.get("/v1/astrology-product-seo/:slug", astrologyProductDetailSeo);

//puja kit
router.get("/v1/puja-kits/:locale?", pujaKitListing);
router.get("/v1/samagri-packages/:slug/:locale?", pujaKitDetail);
router.get("/v1/samagri-seo/:slug", pujaKitSeo);

//Tour
router.get("/v1/religious-tours/:locale?", tourListing);//tourListing
router.get("/v1/religious-tour/:slug/:locale?", tourDetail);
router.get("/v1/religious-tour-seo/:slug", tourDetailSeo);

//Cms
router.get("/v1/cms/:slug/:locale?", cmsDetails)
router.get("/v1/seo/:slug", seo)

router.get("/v1/cart/:locale?", getCartDetails);//jwtAuthMiddleware
router.post("/v1/add-to-cart", addToCart);//jwtAuthMiddleware
router.post("/v1/remove-from-cart", removeFromCart);//jwtAuthMiddleware

router.get("/v1/orders/:status?/:listType?/:locale?", jwtAuthMiddleware, orders);//jwtAuthMiddleware
router.get("/v1/order-details/:id/:locale?", jwtAuthMiddleware, orderDetails);//jwtAuthMiddleware
router.get("/v1/order-detail-item/:id/:locale?", jwtAuthMiddleware, orderDetailItem);//jwtAuthMiddleware
router.delete("/v1/remove-carts",jwtAuthMiddleware, removeCarts); //jwtAuthMiddleware
router.get("/v1/add-to-orders", jwtAuthMiddleware, addToOrder);
router.post("/v1/verify-order", jwtAuthMiddleware, verifyOrder);

// remove cart item on success payment
//router.delete('/v1/remove-item', jwtAuthMiddleware, removeItemsCart)

//add-to-orders get
//remove-carts del

//Magazine
router.get("/v1/magazines/:type_id?", magazineListing);
router.post("/v1/magazine-submission/store", magazineSubmissionSave);
//Subscribe
router.post("/v1/add-subscriber", saveSubscription);


//setting
router.get("/v1/setting-details/:id", settingDetails);
// router.get("/v1/setting-details", setting);


//user address
router.get("/v1/user-address", jwtAuthMiddleware, listingAddress);
router.get("/v1/set-address-to-cart/:id", jwtAuthMiddleware, addUserAddressToCart);
router.post("/v1/add-address", jwtAuthMiddleware, addAddress);
router.post("/v1/remove-address", jwtAuthMiddleware, removeAddresses);



// live
router.get('/v1/joinee-detail/unique-meeting-id/:unique_meeting_id', findJoineeDetailByPujaId)
router.get('/v1/joinee-detail/attendeeId/:attendeeId', findJoineeDetailByAttendeeId)
router.get('/v1/joinee-detail/meetingId/:meetingId', findJoineeDetailByMeetingId)
router.post('/v1/create-joinee-detail/', createJoineeDetail)

router.get('/v1/meeting-detail/unique-meeting-id/:unique_meeting_id', findMeetingDetailByPujaId)
router.get('/v1/meeting-detail/meeting-id/:meeting_id', findMeetingDetailByMeetingId)
router.post('/v1/create-meeting-detail/', createMeetingDetail)

router.get('/v1/create-meeting/', createMeeting)
router.get('/v1/create-attendee/:meeting_id/:user_id', addAttendee)

router.get("/v1/types/:locale?", typeLists);



export default router;