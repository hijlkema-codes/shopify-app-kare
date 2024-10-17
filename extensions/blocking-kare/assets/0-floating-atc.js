/**
 * Handles the creation and display functionality of the floating add to cart.
 *
 * @version 1.0.0-dev
 * @author hijlkema.codes
 * @copyright 2024 hijlkema.codes
 * @license MIT
 */
class FloatingAddToCart {
  // static BUTTON_SELECTOR = "[data-js-product-add-to-cart]";
  static BUTTON_SELECTOR = "[data-js-product-add-to-cart]";
  static TEMPLATE_SELECTOR = "template[data-template='floating-atc-content']";
  static MARGIN_OFFSET = "-100px";

  static #element_instance;
  static #button_element;
  static #observer;

  static {
    this.#button_element = document.querySelector(this.BUTTON_SELECTOR);
    this.#element_instance = this.#createElement();

    this.#observer = new IntersectionObserver(
      this.#intersectionObserverCallback.bind(this),
      {
        rootMargin: `${FloatingAddToCart.MARGIN_OFFSET} 0px ${FloatingAddToCart.MARGIN_OFFSET} 0px`,
        threshold: 0.5,
      },
    );
  }

  loop() {
    FloatingAddToCart.#observer.observe(FloatingAddToCart.#button_element);

    FloatingAddToCart.#element_instance
      ?.querySelector("[data-js-product-add-to-cart]")
      ?.addEventListener("click", () => {
        FloatingAddToCart.#button_element.click();
      });
  }

  /**
   * @returns {HTMLElement}
   */
  static #createElement() {
    const wrapper = document.createElement("div");
    const clone = document
      .querySelector(FloatingAddToCart.TEMPLATE_SELECTOR)
      ?.content.cloneNode(true);
    if (clone) {
      wrapper.append(clone);
    }

    wrapper.classList.add("hc-floating-atc");
    wrapper.setAttribute("data-js-floating-atc", "");
    wrapper.setAttribute("aria-hidden", "true");
    wrapper.setAttribute("role", "dialog");
    wrapper.setAttribute("hidden", "hidden");

    // Add a clone of the button
    // Remove the class button--outline from the clone.
    const buttonClone = this.#button_element?.cloneNode(true);
    if (buttonClone) {
      buttonClone.classList.remove("button--outline");
      // The body should be appended to the data-target='add-to-cart' if it exists. Otherwise directly appended to the wrapper.
      const target = wrapper.querySelector("[data-target='add-to-cart']");
      target
        ? target.appendChild(buttonClone)
        : wrapper.appendChild(buttonClone);

      document.body.appendChild(wrapper);
    }

    return wrapper;
  }

  static #intersectionObserverCallback(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        FloatingAddToCart.#element_instance.removeAttribute("hidden");
      } else {
        FloatingAddToCart.#element_instance.setAttribute("hidden", "hidden");
      }
    });
  }
}

new FloatingAddToCart().loop();
