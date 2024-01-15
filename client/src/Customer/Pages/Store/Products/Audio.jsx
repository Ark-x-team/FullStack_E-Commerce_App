// Importing necessary components and libraries
import { Button } from "@nextui-org/react";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import AudioModal from "./Modals/AudioModal"; // Importing the AudioModal component
import productStore from "../../../../Store/Products/ProductStore";
import customerAuthStore from "../../../../Store/Authentication/CustomerAuthStore";
import cartStore from "../../../../Store/CartStore";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

// Functional component for the Audio
function Audio(props) {
  // Destructuring props
  const { id, name, images, audio, price, play } = props;
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);

  // Handling modal open/close state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Creating a modal component for the AudioModal
  const productModal = (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      backdrop="blur"
      radius="3xl"
    >
      <ModalContent>
        <AudioModal />
      </ModalContent>
    </Modal>
  );

  const { setProduct, getProduct } = productStore(); // Destructuring functions from product store

  const navigate = useNavigate();
  const { addToCart } = cartStore();

  // Function to handle adding audio to cart
  const handleAddToCart = (id, customerId) => {
    // Checking for authentication token using Cookies
    const token = Cookies.get("token");
    if (token) {
      // Adding audio to cart if authenticated
      addToCart(id, customerId);
    } else {
      // Redirecting to login page if not authenticated
      navigate("/login");
    }
  };

  // Initializing translation hook
  const { t } = useTranslation();

  return (
    <>
      {/* Container for the audio component */}
      <div className="cursor-pointer hover:scale-105 duration-500">
        <div
          // Handling click event to set product, fetch data, and open the modal
          onClick={async () => {
            setProduct(id);
            await getProduct(); // Wait for the product data to be fetched
            onOpen(); // Now open the modal
          }}
          className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg xl:aspect-h-8 xl:aspect-w-7"
        >
          <span className="h-48 w-full relative hover:opacity-75 duration-200">
            {/* Displaying the product image */}
            <img
              src={`${import.meta.env.VITE_SERVER_URL}/uploads/${images}`}
              alt={name}
              className="h-48 w-full object-cover object-center dark:brightness-[.8] "
            />
            {/* AudioPlayer component for playing the audio */}
            <AudioPlayer
              ref={audioRef}
              onPlay={() => {
                setShowControls(true);
                play(audioRef);
              }}
              onEnded={() => setShowControls(false)}
              src={`${import.meta.env.VITE_SERVER_URL}/uploads/${audio}`}
              showJumpControls={false}
              autoPlayAfterSrcChange={false}
              autoPlay={false}
              showFilledVolume
              layout="stacked-reverse"
              customIcons={{
                play: (
                  <img src="/icons/play.svg" alt="play" className="w-8 h-8" />
                ),
                pause: (
                  <img src="/icons/pause.svg" alt="pause" className="w-8 h-8" />
                ),
                volume: (
                  <img
                    src="/icons/volume.svg"
                    alt="Volume"
                    className="w-4 h-4"
                  />
                ),
                volumeMute: (
                  <img
                    src="/icons/volume-mute.svg"
                    alt="Volume mute"
                    className="w-4 h-4"
                  />
                ),
              }}
              className={`audio ${
                showControls ? "show-controls" : "hide-controls"
              }`}
            />
          </span>
        </div>
        {/* Container for product details and "Add to Cart" button */}
        <ul className="flex justify-between items-end">
          <li>
            {/* Displaying product name and price */}
            <h3 className="mt-4 text-sm text-gray-700 dark:text-white">
              {name}
            </h3>
            <p className="mt-1 text-lg font-medium text-gray-900 dark:text-slate-300">
              {price} MAD
            </p>
          </li>
          {/* Button for adding audio to cart */}
          <Button
            onClick={() =>
              handleAddToCart(id, customerAuthStore.getState().customerId)
            }
            color="primary"
            variant="light"
            className="w-fit dark:text-primary capitalize"
            endContent={<AddRoundedIcon />}
          >
            {/* Translation for the "add" button */}
            {t("add")}
          </Button>
        </ul>
      </div>
      {/* Rendering the AudioModal when the modal is open */}
      {productModal}
    </>
  );
}

// PropTypes for type-checking the props
Audio.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  images: PropTypes.string.isRequired,
  audio: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  play: PropTypes.func.isRequired,
};

// Exporting the Audio component as the default export
export default Audio;