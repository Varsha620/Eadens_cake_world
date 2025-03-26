import os
from datetime import datetime, timedelta
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_mail import Mail, Message

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bakery.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# File Upload Configuration
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads', 'gallery')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize extensions
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your-email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your-email-password'
mail = Mail(app)

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.Text, nullable=False)
    delivery_date = db.Column(db.DateTime, nullable=False)
    delivery_type = db.Column(db.String(20), nullable=False)
    items = db.Column(db.JSON, nullable=False)
    custom_requirements = db.Column(db.Text)
    reference_photo = db.Column(db.String(255))
    status = db.Column(db.String(20), default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Order {self.id}>'

class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    store_name = db.Column(db.String(100), nullable=False)
    store_email = db.Column(db.String(120), nullable=False)
    store_phone = db.Column(db.String(20))
    store_address = db.Column(db.Text)

class Gallery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_path = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50))  # e.g., 'Wedding', 'Birthday', 'Custom'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Gallery {self.title}>'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/menu')
def menu():
    menu_data = [
        {
            'name': 'Regular Cakes',
            'menu_items': [
                {
                    'id': 1,
                    'name': 'Chocolate Cake',
                    'description': 'Classic chocolate cake with rich chocolate frosting',
                    'price': 600,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 2,
                    'name': 'Vanilla Cake',
                    'description': 'Classic vanilla cake with vanilla buttercream',
                    'price': 600,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 3,
                    'name': 'Black Forest Cake',
                    'description': 'Chocolate cake with cherries and whipped cream',
                    'price': 600,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 4,
                    'name': 'White Forest Cake',
                    'description': 'White chocolate cake with cherries and whipped cream',
                    'price': 600,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 5,
                    'name': 'Oreo Biscuit Cake',
                    'description': 'Delicious cake made with Oreo cookies and cream',
                    'price': 750,
                    'image': 'default-cake.jpg'
                }
            ]
        },
        {
            'name': 'Premium Cakes',
            'menu_items': [
                {
                    'id': 6,
                    'name': 'Red Velvet Cake',
                    'description': 'Classic red velvet cake with cream cheese frosting',
                    'price': 800,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 7,
                    'name': 'Caramel Cake',
                    'description': 'Rich caramel cake with caramel frosting',
                    'price': 800,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 8,
                    'name': 'Vancho Cake',
                    'description': 'Delicious vanilla and chocolate combination cake',
                    'price': 800,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 9,
                    'name': 'Butter Scotch Cake',
                    'description': 'Classic butterscotch cake with caramel drizzle',
                    'price': 800,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 10,
                    'name': 'Chocolate Truffle Cake',
                    'description': 'Rich chocolate truffle cake with ganache',
                    'price': 800,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 11,
                    'name': 'Milk Choco Truffle Cake',
                    'description': 'Milk chocolate truffle cake with creamy ganache',
                    'price': 800,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 12,
                    'name': 'White Chocolate Truffle Cake',
                    'description': 'White chocolate truffle cake with white ganache',
                    'price': 800,
                    'image': 'default-cake.jpg'
                }
            ]
        },
        {
            'name': 'Special Cakes',
            'menu_items': [
                {
                    'id': 13,
                    'name': 'Golden Vancho Cake',
                    'description': 'Premium vanilla chocolate cake with golden touch',
                    'price': 850,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 14,
                    'name': 'Nutty Bubble Cake',
                    'description': 'Delicious cake with nuts and bubble texture',
                    'price': 900,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 15,
                    'name': 'Tender Coconut Cake',
                    'description': 'Fresh tender coconut cake with coconut frosting',
                    'price': 900,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 16,
                    'name': 'Spanish Delight Cake',
                    'description': 'Spanish-style cake with unique flavors',
                    'price': 950,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 17,
                    'name': 'Milky Nuts Cake',
                    'description': 'Creamy cake with assorted nuts',
                    'price': 950,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 18,
                    'name': 'Honey Almond Cake',
                    'description': 'Honey-flavored cake with almond toppings',
                    'price': 950,
                    'image': 'default-cake.jpg'
                }
            ]
        },
        {
            'name': 'Premium Special Cakes',
            'menu_items': [
                {
                    'id': 19,
                    'name': 'Chocolate Overloaded Cake',
                    'description': 'Ultimate chocolate cake for chocolate lovers',
                    'price': 1000,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 20,
                    'name': 'Choco Nut Cake',
                    'description': 'Rich chocolate cake with assorted nuts',
                    'price': 1000,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 21,
                    'name': 'Milk Choco Nut Cake',
                    'description': 'Milk chocolate cake with nuts',
                    'price': 1000,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 22,
                    'name': 'German Black Forest Cake',
                    'description': 'Authentic German Black Forest cake',
                    'price': 1100,
                    'image': 'default-cake.jpg'
                },
                {
                    'id': 23,
                    'name': 'KitKat Gems Cake',
                    'description': 'Cake decorated with KitKat and Gems',
                    'price': 1100,
                    'image': 'default-cake.jpg'
                }
            ]
        },
        {
            'name': 'Small Treats',
            'menu_items': [
                {
                    'id': 24,
                    'name': 'Cup Cakes',
                    'description': 'Assorted flavored cupcakes',
                    'price': 40,
                    'image': 'cupcakes.jpg'
                },
                {
                    'id': 25,
                    'name': 'Cake Pops',
                    'description': 'Delicious bite-sized cake pops',
                    'price': 50,
                    'image': 'cake-pops.jpg'
                },
                {
                    'id': 26,
                    'name': 'Cake Sicles',
                    'description': 'Ice cream style cake pops',
                    'price': 80,
                    'image': 'cake-sicles.jpg'
                }
            ]
        },
        {
            'name': 'Customizations',
            'menu_items': [
                {
                    'id': 27,
                    'name': 'Photo Print',
                    'description': 'Add your photo on the cake',
                    'price': 350,
                    'image': 'default-cake.jpg',
                    'is_addon': True
                },
                {
                    'id': 28,
                    'name': 'Doll Cake',
                    'description': 'Transform your cake into a doll design',
                    'price': 300,
                    'image': 'default-cake.jpg',
                    'is_addon': True
                },
                {
                    'id': 29,
                    'name': 'Tall Cake',
                    'description': 'Make your cake taller',
                    'price': 150,
                    'image': 'default-cake.jpg',
                    'is_addon': True
                },
                {
                    'id': 30,
                    'name': 'Foundant',
                    'description': 'Add foundant decoration',
                    'price': 200,
                    'image': 'default-cake.jpg',
                    'is_addon': True
                }
            ]
        }
    ]
    return render_template('menu.html', menu_categories=menu_data)

@app.route('/cart')
def cart():
    cart_items = session.get('cart', [])
    total = sum(item['price'] * item.get('quantity', 1) for item in cart_items)
    return render_template('cart.html', cart_items=cart_items, total=total)

@app.route('/cart/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    if not data or 'name' not in data or 'price' not in data:
        return jsonify({'success': False, 'message': 'Invalid data'}), 400

    cart_item = {
        'name': data['name'],
        'price': data['price'],
        'quantity': data.get('quantity', 1)
    }

    cart_items = session.get('cart', [])
    cart_items.append(cart_item)
    session['cart'] = cart_items

    return jsonify({'success': True, 'message': 'Item added to cart'})

@app.route('/cart/update/<int:index>', methods=['POST'])
def update_cart_item(index):
    data = request.get_json()
    if not data or 'change' not in data:
        return jsonify({'success': False, 'message': 'Invalid data'}), 400
    
    cart_items = session.get('cart', [])
    if 0 <= index < len(cart_items):
        current_quantity = cart_items[index].get('quantity', 1)
        new_quantity = max(1, current_quantity + data['change'])
        cart_items[index]['quantity'] = new_quantity
        session['cart'] = cart_items
        return jsonify({'success': True, 'message': 'Quantity updated'})
    
    return jsonify({'success': False, 'message': 'Invalid item index'}), 400

@app.route('/cart/remove/<int:index>', methods=['POST'])
def remove_from_cart(index):
    cart_items = session.get('cart', [])
    if 0 <= index < len(cart_items):
        cart_items.pop(index)
        session['cart'] = cart_items
        return jsonify({'success': True, 'message': 'Item removed from cart'})
    return jsonify({'success': False, 'message': 'Invalid item index'}), 400

@app.route('/cart/clear', methods=['POST'])
def clear_cart():
    session['cart'] = []
    return jsonify({'success': True, 'message': 'Cart cleared'})

@app.route('/customize')
def customize():
    return render_template('customize.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            login_user(user)
            return redirect(url_for('admin_dashboard'))
        
        flash('Invalid username or password')
    return render_template('admin/login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/admin')
@login_required
def admin_dashboard():
    orders = Order.query.order_by(Order.delivery_date.desc()).all()
    return render_template('admin/dashboard.html', orders=orders)

@app.route('/admin/order/<int:order_id>')
@login_required
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    return jsonify({
        'id': order.id,
        'name': order.name,
        'email': order.email,
        'phone': order.phone,
        'address': order.address,
        'delivery_date': order.delivery_date.isoformat(),
        'delivery_type': order.delivery_type,
        'items': order.items,
        'custom_requirements': order.custom_requirements,
        'reference_photo': order.reference_photo,
        'status': order.status
    })

@app.route('/admin/update_status', methods=['POST'])
@login_required
def admin_update_order_status():
    data = request.get_json()
    order_id = data.get('order_id')
    new_status = data.get('status')
    
    if not order_id or not new_status:
        return jsonify({'success': False, 'error': 'Missing order_id or status'}), 400
    
    order = Order.query.get_or_404(order_id)
    order.status = new_status
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/order/create', methods=['POST'])
def create_order():
    if not session.get('cart'):
        return jsonify({'success': False, 'message': 'Cart is empty'})

    data = request.get_json()
    order = {
        'name': data.get('name'),
        'email': data.get('email'),
        'phone': data.get('phone'),
        'order_type': data.get('delivery_type'),
        'address': data.get('address') if data.get('delivery_type') == 'delivery' else None,
        'delivery_date': data.get('delivery_date'),
        'delivery_time': data.get('delivery_time'),
        'items': session['cart'],
        'total': sum(item['price'] * item['quantity'] for item in session['cart']),
        'custom_requirements': data.get('custom_requirements'),
        'status': 'pending',
        'order_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    # Here you would typically save the order to your database
    # For now, we'll just clear the cart
    session['cart'] = []
    return jsonify({'success': True})

@app.route('/api/order/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    data = request.get_json()
    status = data.get('status')
    
    if not status:
        return jsonify({'status': 'error', 'message': 'Status is required'}), 400
        
    order = Order.query.get_or_404(order_id)
    order.status = status
    db.session.commit()
    
    return jsonify({'status': 'success'})

@app.route('/gallery')
def gallery():
    category = request.args.get('category')
    if category:
        photos = Gallery.query.filter_by(category=category).order_by(Gallery.created_at.desc()).all()
    else:
        photos = Gallery.query.order_by(Gallery.created_at.desc()).all()
    categories = db.session.query(Gallery.category).distinct().all()
    return render_template('gallery.html', photos=photos, categories=categories, selected_category=category)

@app.route('/admin/gallery')
@login_required
def admin_gallery():
    photos = Gallery.query.order_by(Gallery.created_at.desc()).all()
    return render_template('admin/gallery.html', photos=photos)

@app.route('/admin/gallery/upload', methods=['POST'])
@login_required
def upload_gallery_photo():
    if 'photo' not in request.files:
        flash('No file selected')
        return redirect(url_for('admin_gallery'))
    
    file = request.files['photo']
    if file.filename == '':
        flash('No file selected')
        return redirect(url_for('admin_gallery'))
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add timestamp to filename to make it unique
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        photo = Gallery(
            title=request.form.get('title'),
            description=request.form.get('description'),
            category=request.form.get('category'),
            image_path=filename
        )
        db.session.add(photo)
        db.session.commit()
        
        flash('Photo uploaded successfully')
        return redirect(url_for('admin_gallery'))
    
    flash('Invalid file type')
    return redirect(url_for('admin_gallery'))

@app.route('/admin/gallery/<int:photo_id>/delete', methods=['POST'])
@login_required
def delete_gallery_photo(photo_id):
    photo = Gallery.query.get_or_404(photo_id)
    
    # Delete the file
    try:
        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], photo.image_path))
    except:
        pass  # File might not exist
    
    # Delete database record
    db.session.delete(photo)
    db.session.commit()
    
    flash('Photo deleted successfully')
    return redirect(url_for('admin_gallery'))

@app.route('/admin/gallery/<int:photo_id>/edit', methods=['POST'])
@login_required
def edit_gallery_photo(photo_id):
    photo = Gallery.query.get_or_404(photo_id)
    
    photo.title = request.form.get('title')
    photo.description = request.form.get('description')
    photo.category = request.form.get('category')
    
    db.session.commit()
    flash('Photo details updated successfully')
    return redirect(url_for('admin_gallery'))

# Create tables and admin user
with app.app_context():
    db.create_all()
    
    # Create admin user if it doesn't exist
    if not User.query.filter_by(username='admin').first():
        admin = User(username='admin')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True)
