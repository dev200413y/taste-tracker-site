import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">QuickMart</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for all daily essentials. Fast delivery, quality products, 
              and excellent customer service.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-foreground">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-muted-foreground hover:text-foreground">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/category/fruits-vegetables" className="text-muted-foreground hover:text-foreground">
                  Fruits & Vegetables
                </Link>
              </li>
              <li>
                <Link to="/category/dairy-bread-eggs" className="text-muted-foreground hover:text-foreground">
                  Dairy & Eggs
                </Link>
              </li>
              <li>
                <Link to="/category/snacks-munchies" className="text-muted-foreground hover:text-foreground">
                  Snacks
                </Link>
              </li>
              <li>
                <Link to="/category/personal-care" className="text-muted-foreground hover:text-foreground">
                  Personal Care
                </Link>
              </li>
              <li>
                <Link to="/category/baby-care" className="text-muted-foreground hover:text-foreground">
                  Baby Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>support@quickmart.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>123 Market Street, City, State 12345</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Newsletter</h4>
              <div className="flex space-x-2">
                <Input placeholder="Your email" className="text-sm" />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 QuickMart. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-muted-foreground hover:text-foreground">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};