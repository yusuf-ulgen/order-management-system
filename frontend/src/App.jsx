import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // Örnek Menü Verisi
  const [menuItems] = useState([
    { id: 1, name: "Türk Kahvesi", price: 60, category: "İçecek" },
    { id: 2, name: "Filtre Kahve", price: 75, category: "İçecek" },
    { id: 3, name: "Latte", price: 85, category: "İçecek" },
    { id: 4, name: "Brownie", price: 110, category: "Tatlı" },
    { id: 5, name: "Tiramisu", price: 120, category: "Tatlı" },
  ]);

  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleSendOrder = async () => {
    const orderData = {
      tableNumber: "5", // Şimdilik sabit, sonra QR'dan alacağız
      items: cart.map(item => item.name).join(", "),
      totalPrice: cart.reduce((total, item) => total + item.price, 0),
      status: "Yeni"
    };

    try {
      // Backend'e (8081 portuna) veriyi gönderiyoruz
      const response = await fetch("http://localhost:8081/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert("Sipariş başarıyla mutfağa iletildi!");
        setCart([]);
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Sipariş gönderilemedi, sunucu kapalı olabilir.");
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f4f9', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Üst Bar */}
      <Navbar bg="dark" variant="dark" sticky="top" className="shadow">
        <Container>
          <Navbar.Brand className="fw-bold">☕ Kafe Menü</Navbar.Brand>
          <Badge bg="primary" pill>{cart.length} Ürün</Badge>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h2 className="text-center mb-4 fw-light">Menümüz</h2>
        <Row>
          {menuItems.map((item) => (
            <Col xs={12} md={6} key={item.id} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{item.name}</h5>
                    <small className="text-muted d-block mb-2">{item.category}</small>
                    <span className="fw-bold text-primary">{item.price} TL</span>
                  </div>
                  <Button variant="outline-dark" size="sm" onClick={() => addToCart(item)}>
                    Ekle +
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Alt Sipariş Barı (Sadece ürün varsa görünür) */}
      {cart.length > 0 && (
        <div className="fixed-bottom p-3 bg-white border-top shadow-lg animate__animated animate__slideInUp">
          <Container>
            <Button variant="success" className="w-100 py-3 fw-bold shadow" onClick={handleSendOrder}>
              SİPARİŞİ TAMAMLA ({cart.reduce((total, item) => total + item.price, 0)} TL)
            </Button>
          </Container>
        </div>
      )}
    </div>
  );
}

export default App;