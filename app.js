import {initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBMwy47vR2AEH2EQ08RQFF8ToEItOwsF40",
  authDomain: "boutique-app-9e16a.firebaseapp.com",
  projectId: "boutique-app-9e16a",
  storageBucket: "boutique-app-9e16a.firebasestorage.app",
  messagingSenderId: "715098617151",
  appId: "1:715098617151:web:5332fe95c6037c4aa34f8a",
  measurementId: "G-0PLEPJFJ1C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const OWNER_WHATSAPP = "201093929315";


async function loadProducts(categoryFilter = 'all') {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '<p>جاري تحميل المنتجات</p>';
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        grid.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const item = doc.data();

            if (categoryFilter !== 'all' && item.category !== categoryFilter) return;


            const whatsappText = encodeURIComponent(`اهلا,حابب استفسر /اطلب القطعة دي : ${item.name} - بسعر ${item.price} جنيه`);
            const whatsappLink = `https://wa.me/${OWNER_WHATSAPP}?text=${whatsappText}`;


            const isAvailable = item.inStock;
            const badgeClass = isAvailable ? 'in-stock' : 'out-of-stock';
            const badgeText = isAvailable ? 'نفدت الكمية': 'متوفر';

            const cardHTML = `
            <div class="product-card">
            <span class="stock-badge ${badgeClass}"> ${badgeText} </span>
            <img src="${item.image}" alt="${item.name}" class="product-img">
            <div class="product-info">
            <h3 class="product-title">${item.name}</h3>
            <div class="product-price">${item.price} ج.م</div>
            ${isAvailable} ? `<a href="${whatsappLink}" target="-blank" class="order-btn">طلب عبر الواتساب</a>`
            : `<button class="order-btn disabled" disabled> غير متوفر حاليا</button>`
             }
            </div>
            </div>
            `;
            grid.innerHTML += cardHTML;
        });
        
    } catch (e) {
        grid.innerHTML = '<p>حدث خطأ أثناء تحميل المنتجات</p>';
        console.error("Error loading products: " , e);
    }
    
}

const adminForm = document.getElementById('add-product-form');
if (adminForm) {
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newProduct = {
            name: document.getElementById('p-name').value,
            price:Number(document.getElementById('p-price').value),
            category: document.getElementById('p-category').value,
            image:document.getElementById('p-image').value,
            inStock: document.getElementById('p-instock').checked

        };
        try{
            await addDoc(collection(db, "products"), newProduct);
            alert('تم اضافة المنتج بنجاح');
            adminForm.reset();
        }catch (e) {
            alert('! حدث خطأ أثناء الحفظ');
            console.error("Error adding document:" , e);
        }
    });

}

loadProducts();

