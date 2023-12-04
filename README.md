# Tinder Clone Client
Link Admin + Sever: https://github.com/trakongot/sever_tinder_clone
## Screenshots

1. **Login Screen:**
   [Imgur](https://i.imgur.com/xePv9nh.png)
2. **View Other Profile:**
   [Imgur](https://i.imgur.com/CnX6Bej.png)
3. **Like Or Unlike:**
   [Imgur](https://i.imgur.com/KutBzuU.png)
4. **Settings:**
   - Edit Profile:
     [Imgur](https://i.imgur.com/OpjRaTP)
   - Upload Photo From File:
     [Imgur](https://i.imgur.com/eWDdIBC)
   - Upload Photo From Screenshot:
     [Imgur](https://i.imgur.com/l2tubF6)
   - Edit Uploaded Photo:
     [Imgur](https://i.imgur.com/uSLILDs)
   - Add Languages:
     [Imgur](https://i.imgur.com/6GQ95pS)
   - Update Profile:
     [Imgur](https://i.imgur.com/i1VlUsv)
   - Select Sexual Orientation:
     [Imgur](https://i.imgur.com/pv4bJ3e)
5. **Initiate Call:**
   [Imgur](https://i.imgur.com/8nTPXlv)
6. **Video Call:**
   [Imgur](https://i.imgur.com/TRVEQnA)
7. **Admin Panel:**
   [Imgur](https://i.imgur.com/a/V0N1Y8G)
8. **Admin Panel:**
   [Imgur](https://i.imgur.com/a/uD4eADi)
9. **Database:**
   [Imgur](https://i.imgur.com/T575hUz.jpg)
10. **Sever:**
    [Imgur](https://i.imgur.com/HLe30ct.png)

## Tính Năng Nổi Bật

### Trang Người Dùng

- **Đăng Nhập:**

  - Tích hợp tính năng đăng nhập an toàn và bảo mật thông qua các tài khoản Google và Facebook, giúp cung cấp trải  
    nghiệm người dùng thuận tiện và tăng cường độ tin cậy của hệ thống.

- **Hồ Sơ và Thẻ Hình Ảnh:**

  - Hiển thị hồ sơ cá nhân với thông tin chi tiết và thẻ hình ảnh thú vị.
  - Chỉnh sửa đăng tải hình ảnh, thông tin cá nhân như sở thích, giới tính ...

- **Tìm Kiếm và Kết Nối:**

  - Duyệt qua các hồ sơ và tương tác với người dùng khác thông qua các tùy chọn "thích", "không thích".

- **Trò Chuyện:**

  - Tính năng trò chuyện giúp người dùng bắt đầu giao tiếp và tìm hiểu nhau hơn.
  - sử dụng PeerJS để triển khai tính năng video call, tạo cơ hội cho người dùng kết nối trực tiếp qua video.

### Trang Admin

- **Quản Lý Người Dùng:**

  - Trang quản lý cung cấp giao diện dễ sử dụng để kiểm soát và xem thông tin người dùng.
  - Tích hợp Twilio để triển khai tính năng gửi mã OTP để xác minh danh tính Admin.
  - Gender user ảo , tin nhắn ảo để thử nghiệm.

### Đăng Nhập và Xác Thực

- **Google Login API và Facebook Login API:**

  - Tích hợp đăng nhập thông qua tài khoản Google và Facebook để tối ưu hóa trải nghiệm đăng nhập người dùng.

- **JWT Authentication:**

  - Sử dụng JWT (JSON Web Tokens) để xác thực và duy trì trạng thái đăng nhập của người dùng.

- **HttpOnly Cookies cho JWT:**

  - Đảm bảo an toàn cho dữ liệu đăng nhập bằng cách sử dụng cookies HttpOnly cho việc lưu trữ và truyền tải JWT.

## Công Nghệ Nền Tảng

- **React + Typescript + Tailwind CSS:**

  - Kết hợp sức mạnh của thư viện React,tính an toàn với kiểu dữ liệu từ Typescript, và linh hoạt trong thiết kế giao
    diện với Tailwind CSS. Sự kết hợp này mang lại ưu điểm về kiểm soát dữ liệu, hiệu suất và khả năng tùy chỉnh giao
    diện, tạo ra một môi trường phát triển linh hoạt và hiệu quả cho ứng dụng web.

- **React Query + Axios:**

  - Quản lý trạng thái và thực hiện các truy vấn dữ liệu hiệu quả từ server.

- **Frame Motion + Swiper:**

  - Tạo hiệu ứng mượt mà và tương tác thú vị khi quẹt thẻ, xem ảnh trong giao diện người dùng.

- **Redux Toolkit:**

  - Quản lý trạng thái toàn cầu và các tác vụ phức tạp.

## Hướng Dẫn Cài Đặt Dự Án
(Lưu ý phải cài sever trước link cài sever : https://github.com/trakongot/sever_tinder_clone)
1. **Clone Repository:**

   ```bash
   git clone https://github.com/trakongot/tinder_clone_client.git
   cd tinder-clone-client
   ```

2. **Cài dependencies và sửa lỗi chính tả trong trang người dùng:**

```bash
 yarn install
```

```bash
yarn lint
yarn lint:fix
yarn prettier
yarn prettier:fix
```
- note bốn lệnh trên kiểm tra lỗi chính tả và sửa lỗi chính tả tự động (nếu có thể)

## Hướng Dẫn Chạy Dự Án

```bash
yarn run dev
```

