Cài đặt các thư viện có trong dự án: npm install

Sau đó mở file session.json trong thư mục value chỉnh sửa các giá trị bên trong.
    - SessionID và CSRF là value của cookie instagram của bạn.
    - Token là token nick fb của bạn.

Sau đó sử dụng lệnh: node app.js để chạy tool.

Lưu ý: id fb phải ở dạng UID tức là dạng: 100005066654412 chứ không phải dạng https://www.fb.com/ThanhTuanCristiano, bạn có thể vào trang https://id.atpsoftware.vn/ để đổi từ dạng url sang UID

Tiếp đó, sử dụng các phương thức khác của trình phân tích dữ liệu để lấy dữ liệu về sinh viên. Tham khảo thêm tại mẫu ví dụ: test.js 
Author: EagleTeam