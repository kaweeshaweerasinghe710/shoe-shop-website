import { useLanguage } from '../context/LanguageContext';
import './About.css';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>{t('aboutUs')}</h1>
        <p>Your trusted partner in fashion and quality</p>
      </div>

      <div className="about-container">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Welcome to Elite Shoe Shop, where style meets comfort and quality. Since our establishment,
            we've been dedicated to providing our customers with the finest selection of footwear, bags,
            and accessories from around the world.
          </p>
          <p>
            Our journey began with a simple vision: to create a shopping destination where everyone can
            find the perfect products that reflect their personal style and meet their lifestyle needs.
            Today, we're proud to serve thousands of satisfied customers who trust us for their fashion
            and accessory needs.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="2"/>
                  <path d="M9 12L11 14L15 10" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Quality Products</h3>
              <p>We source only authentic, high-quality products from trusted brands and manufacturers.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" strokeWidth="2"/>
                  <path d="M12 7V12L15 15" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping to ensure your products arrive on time.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="2"/>
                  <path d="M8 12H16M12 8V16" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Customer Service</h3>
              <p>Our dedicated support team is here to assist you with any questions or concerns.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" strokeWidth="2"/>
                  <path d="M7 12L10 15L17 8" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Easy Returns</h3>
              <p>Not satisfied? We offer a hassle-free 30-day return policy on all purchases.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Visit Our Store</h2>
          <p>
            Come visit us at our physical location! Our friendly staff would love to help you find
            the perfect products in person.
          </p>

          <div className="store-info">
            <div className="info-item">
              <h4>Address</h4>
              <p>123 Fashion Street, Style City, SC 12345</p>
            </div>
            <div className="info-item">
              <h4>Hours</h4>
              <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
              <p>Sunday: 10:00 AM - 6:00 PM</p>
            </div>
            <div className="info-item">
              <h4>Contact</h4>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Email: info@eliteshoeshop.com</p>
            </div>
          </div>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.4737824489185!2d-73.98823492346662!3d40.74844097138734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
