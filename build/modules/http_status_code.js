"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = exports.HttpStatusCode = exports.ServerErrorResponse = exports.ClientErrorResponse = exports.RedirectionMessage = exports.SuccessfulResponse = exports.InformationResponse = void 0;
/** @description 資訊回應 */
class InformationResponse {
    /**
     * @description 這個臨時回應表示用戶端應該繼續請求，或者如果請求已經完成，則忽略該回應。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/100}
     */
    static CONTINUE = 100;
    /**
     * @description 這個代碼是作為對來自用戶端的 Upgrade 請求標頭的回應，並指示伺服器正在切換到的協議。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/101}
     */
    static SWITCHING_PROTOCOLS = 101;
    /**
     * @description 這個代碼表示伺服器已收到並正在處理請求，但還沒有可用的回應。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/102}
     */
    static PROCESSING = 102;
    /**
     * @description 這個狀態碼主要用於與 Link 標頭一起使用，讓用戶代理在伺服器準備回應或者頁面需要從中獲取資源的原始來源時，開始預加載資源或者預連接。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/103}
     */
    static EARLY_HINTS = 103;
}
exports.InformationResponse = InformationResponse;
/** @description 成功回應 */
class SuccessfulResponse {
    /**
     * @description 請求成功。「成功」的結果含義取決於 HTTP 方法：
     * - `GET`：資源已被檢索並在訊息主體中傳送。
     * - `HEAD`：回應中包含表示標頭，但沒有任何訊息主體。
     * - `PUT` 或 `POST`：描述操作結果的資源在訊息主體中傳送。
     * - `TRACE`：訊息主體包含了伺服器接收到的請求訊息。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/200}
     */
    static OK = 200;
    /**
     * @description 請求成功，並因此創建了一個新的資源。這通常是在 POST 請求或某些 PUT 請求之後發送的回應。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/201}
     */
    static CREATED = 201;
    /**
     * @description 已接收請求，但尚未對其進行處理。由於在 HTTP 中沒有後續發送表示請求結果的非同步回應的方法，因此此回應是非承諾性的。它適用於另一個處理請求的進程或伺服器，或用於批處理。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/202}
     */
    static ACCEPTED = 202;
    /**
     * @description 此回應代碼表示返回的元資料與原始伺服器提供的資料不完全相同，而是從本地或第三方副本收集的。這主要用於另一個資源的鏡像或備份。除了這種特定情況外，200 OK 回應優先於此狀態。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/203}
     */
    static NON_AUTHORITATIVE_INFORMATION;
    /**
     * @description 沒有內容可發送給此請求，但標頭可能很有用。用戶端可以使用新的標頭更新此資源的快取標頭。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/204}
     */
    static NO_CONTENT = 204;
    /**
     * @description 告訴用戶端重置發送此請求的文件。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/205}
     */
    static RESET_CONTENT = 205;
    /**
     * @description 當從用戶端發送的 Range 標頭請求部分資源時，使用此回應代碼。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/206}
     */
    static PARTIAL_CONTENT = 206;
    /**
     * @description 傳達有關多個資源的資訊，適用於可能適用多個狀態碼的情況。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/207}
     */
    static MULTI_STATUS = 207;
    /**
     * @description 在 <dav:propstat> 回應元素中使用，以避免反復列舉對同一集合的多個綁定的內部成員。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/208}
     */
    static ALREADY_REPORTED = 208;
    /**
     * @description 伺服器已滿足對資源的 GET 請求，並且回應是對當前實例應用的一個或多個實例操作的結果的表示。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/226}
     */
    static IM_USED = 226;
}
exports.SuccessfulResponse = SuccessfulResponse;
/** @description 重新導向訊息 */
class RedirectionMessage {
    /**
     * @description 該請求有多個可能的回應。用戶代理或用戶應該選擇其中一個。（沒有標準的選擇回應的方法，但建議使用 HTML 鏈接到這些可能性，以便用戶可以進行選擇。）
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/300}
     */
    static MULTIPLE_CHOICES = 300;
    /**
     * @description 所請求的資源的 URL 已永久更改。新的 URL 在回應中給出。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/301}
     */
    static MOVED_PERMANENTLY = 301;
    /**
     * @description 此回應代碼表示所請求的資源的 URI 已暫時更改。將來可能對 URI 進行進一步更改。因此，用戶端應在以後的請求中使用相同的 URI。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/302}
     */
    static FOUND = 302;
    /**
     * @description 伺服器發送此回應以指示用戶端使用 GET 請求在另一個 URI 獲取所請求的資源。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/303}
     */
    static SEE_OTHER = 303;
    /**
     * @description 這用於緩存目的。它告訴用戶端回應未被修改，因此用戶端可以繼續使用回應的相同緩存版本。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/304}
     */
    static NOT_MODIFIED = 304;
    /**
     * @description 在 HTTP 規範的先前版本中定義，表示必須通過代理訪問所請求的回應。由於關於代理的帶內設定的安全問題，它已被棄用。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/305}
     */
    static USE_PROXY = 305;
    /**
     * @description 此回應代碼不再使用；它只是保留的。它曾在 HTTP/1.1 規範的先前版本中使用過。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/306}
     */
    static UNUSED = 306;
    /**
     * @description 伺服器發送此回應以指示用戶端使用在先前請求中使用的相同方法，在另一個 URI 獲取所請求的資源。這與 302 Found HTTP 回應代碼具有相同的語義，唯一的區別在於用戶代理不能改變使用的 HTTP 方法：如果在第一個請求中使用了 POST，則在第二個請求中必須使用 POST。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/307}
     */
    static TEMPORARY_REDIRECT = 307;
    /**
     * @description 這意味著資源現在永久位於另一個 URI，由 Location: HTTP 回應標頭指定。這與 301 Moved Permanently HTTP 回應代碼具有相同的語義，唯一的區別在於用戶代理不能改變使用的 HTTP 方法：如果在第一個請求中使用了 POST，則在第二個請求中必須使用 POST。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/308}
     */
    static PERMANENT_REDIRECT = 308;
}
exports.RedirectionMessage = RedirectionMessage;
/** @description 用戶端錯誤回應 */
class ClientErrorResponse {
    /**
     * @description 由於被認為是用戶端錯誤的原因（例如，錯誤的請求語法、無效的請求訊息框架或欺騙性的請求路由），伺服器無法或不會處理該請求。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/400}
     */
    static BAD_REQUEST = 400;
    /**
     * @description 儘管 HTTP 標準指定為「未授權」，但從語義上講，此回應意味著「未經身份驗證」。也就是說，用戶端必須進行身份驗證才能獲取所請求的回應。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/401}
     */
    static UNAUTHORIZED = 401;
    /**
     * @description 此回應代碼保留供將來使用。最初創建此代碼的目的是用於數位支付系統，但此狀態碼極少使用，且沒有標準約定存在。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/402}
     */
    static PAYMENT_REQUIRED = 402;
    /**
     * @description 用戶端沒有訪問內容的權限；即未經授權，因此伺服器拒絕提供所請求的資源。與 401 Unauthorized 不同，伺服器已知道用戶端的身份。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/403}
     */
    static FORBIDDEN = 403;
    /**
     * @description 伺服器找不到所請求的資源。在瀏覽器中，這意味著 URL 不被識別。在 API 中，這也可能表示端點是有效的，但資源本身不存在。伺服器可能會發送此回應代碼，而不是 403 Forbidden，以隱藏未經授權的用戶端的資源存在。 由於其在網路上的頻繁出現，此回應代碼可能是最為人熟知的。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/404}
     */
    static NOT_FOUND = 404;
    /**
     * @description 伺服器知道請求方法，但不支援目標資源。例如，API 可能不允許調用 DELETE 來刪除資源。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/405}
     */
    static METHOD_NOT_ALLOWED = 405;
    /**
     * @description 當網路伺服器在伺服器驅動的內容協商後，找不到符合用戶代理給定標準的內容時，就會發送此回應。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/406}
     */
    static NOT_ACCEPTABLE = 406;
    /**
     * @description 這與 401 Unauthorized 類似，但需要代理進行驗證。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/407}
     */
    static PROXY_AUTHENTICATION_REQUIRED = 407;
    /**
     * @description 一些伺服器在閒置連接時發送此回應，即使用戶端之前沒有發送任何請求。這意味著伺服器希望關閉此未使用的連接。由於一些瀏覽器（如 Chrome、Firefox 27+ 或 IE9）使用 HTTP 預連接機制加快瀏覽速度，因此此回應用得更多。還要注意，一些伺服器僅關閉連接而不發送此消息。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/408}
     */
    static REQUEST_TIMEOUT = 408;
    /**
     * @description 當請求與伺服器的當前狀態存在衝突時，就會發送此回應。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/409}
     */
    static CONFLICT = 409;
    /**
     * @description 當所請求的內容已永久從伺服器中刪除且沒有轉發地址時，就會發送此回應。用戶端應該刪除其緩存和指向資源的鏈接。HTTP 規範打算將此狀態碼用於「有限時間的促銷服務」。API 不應感到有必要使用此狀態碼來指示已刪除的資源。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/410}
     */
    static GONE = 410;
    /**
     * @description 伺服器拒絕了請求，因為未定義 Content-Length 標頭欄位，而伺服器需要它。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/411}
     */
    static LENGTH_REQUIRED = 411;
    /**
     * @description 用戶端在其標頭中指示了伺服器未達到的前提條件。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/412}
     */
    static PRECONDITION_FAILED = 412;
    /**
     * @description 請求實體大於伺服器定義的限制。伺服器可能會關閉連接或返回 Retry-After 標頭欄位。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/413}
     */
    static PAYLOAD_TOO_LARGE = 413;
    /**
     * @description 用戶端所請求的 URI 長度超過伺服器願意解釋的範圍。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/414}
     */
    static URI_TOO_LONG = 414;
    /**
     * @description 所請求資料的媒體格式不受伺服器支援，因此伺服器拒絕該請求。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/415}
     */
    static UNSUPPORTED_MEDIA_TYPE = 415;
    /**
     * @description 請求中 Range 標頭欄位指定的範圍無法滿足。可能是目標 URI 的資料大小超出了範圍。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/416}
     */
    static RANGE_NOT_SATISFIABLE = 416;
    /**
     * @description 此回應代碼意味著伺服器無法滿足 Expect 請求標頭欄位指示的期望。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/417}
     */
    static EXPECTATION_FAILED = 417;
    /**
     * @description 伺服器拒絕使用茶壺沖泡咖啡的嘗試。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/418}
     */
    static IM_A_TEAPOT = 418;
    /**
     * @description 所發送的請求是針對無法產生回應的伺服器的。這可以由未配置為產生包含在請求 URI 中的方案和權限組合的回應的伺服器發送。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/421}
     */
    static MISDIRECTED_REQUEST = 421;
    /**
     * @description 請求格式良好，但由於語義錯誤而無法遵循。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/422}
     */
    static UNPROCESSABLE_CONTENT = 422;
    /**
     * @description 正在訪問的資源被鎖定。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/423}
     */
    static LOCKED = 423;
    /**
     * @description 由於之前的請求失敗，請求失敗。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/424}
     */
    static FAILED_DEPENDENCY = 424;
    /**
     * @description 表示伺服器不願冒險處理可能被重播的請求。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/425}
     */
    static TOO_EARLY = 425;
    /**
     * @description 伺服器拒絕使用當前協議執行請求，但在用戶端升級到不同協議後可能會願意這樣做。伺服器在 426 回應中使用 Upgrade 標頭來指示所需的協議。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/426}
     */
    static UPGRADE_REQUIRED = 426;
    /**
     * @description 原始伺服器需要請求具有條件。此回應旨在防止「丟失更新」問題，即當用戶端 GET 資源的狀態、修改它並將其 PUT 回伺服器時，同時第三方已在伺服器上修改了狀態，導致衝突。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/428}
     */
    static PRECONDITION_REQUIRED = 428;
    /**
     * @description 用戶在給定時間內發送了過多的請求（「速率限制」）。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/429}
     */
    static TOO_MANY_REQUESTS = 429;
    /**
     * @description 伺服器不願處理該請求，因為其標頭欄位太大。減小請求標頭欄位的大小後，可以重新提交請求。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/431}
     */
    static REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
    /**
     * @description 用戶代理請求無法合法提供的資源，例如被政府審查的網頁。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/451}
     */
    static UNAVAILABLE_FOR_LEGAL_REASONS = 451;
}
exports.ClientErrorResponse = ClientErrorResponse;
/** @description 伺服器錯誤回應 */
class ServerErrorResponse {
    /**
     * @description 伺服器遇到一個它不知道如何處理的情況。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/500}
     */
    static INTERNAL_SERVER_ERROR = 500;
    /**
     * @description 伺服器不支援請求方法，無法處理。伺服器需要支援的唯一方法（因此不應返回此代碼）是 GET 和 HEAD。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/501}
     */
    static NOT_IMPLEMENTED = 501;
    /**
     * @description 此錯誤回應表示，伺服器在作為閘道器以獲取處理請求所需的回應時，收到了無效的回應。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/502}
     */
    static BAD_GATEWAY = 502;
    /**
     * @description 伺服器尚未準備好處理該請求。常見原因是伺服器正在進行維護或負載過重。需要注意的是，除了此回應外，還應該發送一個用戶友好的頁面來解釋問題。此回應應該用於暫時的情況，並且如果可能，Retry-After HTTP 標頭應包含服務恢復之前的估計時間。網站管理員還必須注意與此回應一起發送的與緩存相關的標頭，因為這些暫時的狀態回應通常不應該被緩存。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/503}
     */
    static SERVICE_UNAVAILABLE = 503;
    /**
     * @description 當伺服器充當閘道器且無法及時獲得回應時，將提供此錯誤回應。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/504}
     */
    static GATEWAY_TIMEOUT = 504;
    /**
     * @description 請求中使用的 HTTP 版本不受伺服器支援。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/505}
     */
    static HTTP_VERSION_NOT_SUPPORTED = 505;
    /**
     * @description 伺服器存在內部配置錯誤：所選擇的變體資源被配置為自行參與透明內容協商，因此不是協商過程中的適當端點。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/506}
     */
    static VARIANT_ALSO_NEGOTIATES = 506;
    /**
     * @description 由於伺服器無法存儲成功完成請求所需的表示，因此無法對資源執行該方法。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/507}
     */
    static INSUFFICIENT_STORAGE = 507;
    /**
     * @description 伺服器在處理請求時檢測到無限循環。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/508}
     */
    static LOOP_DETECTED = 508;
    /**
     * @description 需要對請求進行進一步擴展，以便伺服器能夠完成它。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/510}
     */
    static NOT_EXTENDED = 510;
    /**
     * @description 表示用戶端需要進行身份驗證以獲取網路訪問。
     * @see {@link https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Status/511}
     */
    static NETWORK_AUTHENTICATION_REQUIRED = 511;
}
exports.ServerErrorResponse = ServerErrorResponse;
/** @description HTTP回應狀態碼 */
class HttpStatusCode {
    /** @description 資訊回應 */
    static INFORMATIONAL_RESPONSE = InformationResponse;
    /** @description 成功回應 */
    static SUCCESSFUL_RESPONSE = SuccessfulResponse;
    /** @description 重新導向訊息 */
    static REDIRECTION_MESSAGE = RedirectionMessage;
    /** @description 用戶端錯誤回應 */
    static CLIENT_ERROR_RESPONSE = ClientErrorResponse;
    /** @description 伺服器錯誤回應 */
    static SERVER_ERROR_RESPONSE = ServerErrorResponse;
    static category_map = new Map([
        [100, InformationResponse],
        [101, InformationResponse],
        [102, InformationResponse],
        [103, InformationResponse],
        [200, SuccessfulResponse],
        [201, SuccessfulResponse],
        [202, SuccessfulResponse],
        [203, SuccessfulResponse],
        [204, SuccessfulResponse],
        [205, SuccessfulResponse],
        [206, SuccessfulResponse],
        [207, SuccessfulResponse],
        [208, SuccessfulResponse],
        [226, SuccessfulResponse],
        [300, RedirectionMessage],
        [301, RedirectionMessage],
        [302, RedirectionMessage],
        [303, RedirectionMessage],
        [304, RedirectionMessage],
        [305, RedirectionMessage],
        [306, RedirectionMessage],
        [307, RedirectionMessage],
        [308, RedirectionMessage],
        [400, ClientErrorResponse],
        [401, ClientErrorResponse],
        [402, ClientErrorResponse],
        [403, ClientErrorResponse],
        [404, ClientErrorResponse],
        [405, ClientErrorResponse],
        [406, ClientErrorResponse],
        [407, ClientErrorResponse],
        [408, ClientErrorResponse],
        [409, ClientErrorResponse],
        [410, ClientErrorResponse],
        [411, ClientErrorResponse],
        [412, ClientErrorResponse],
        [413, ClientErrorResponse],
        [414, ClientErrorResponse],
        [415, ClientErrorResponse],
        [416, ClientErrorResponse],
        [417, ClientErrorResponse],
        [418, ClientErrorResponse],
        [421, ClientErrorResponse],
        [422, ClientErrorResponse],
        [423, ClientErrorResponse],
        [424, ClientErrorResponse],
        [425, ClientErrorResponse],
        [426, ClientErrorResponse],
        [428, ClientErrorResponse],
        [429, ClientErrorResponse],
        [431, ClientErrorResponse],
        [451, ClientErrorResponse],
        [500, ServerErrorResponse],
        [501, ServerErrorResponse],
        [502, ServerErrorResponse],
        [503, ServerErrorResponse],
        [504, ServerErrorResponse],
        [505, ServerErrorResponse],
        [506, ServerErrorResponse],
        [507, ServerErrorResponse],
        [508, ServerErrorResponse],
        [510, ServerErrorResponse],
        [511, ServerErrorResponse]
    ]);
    static status_code_object_map = new Map([
        [100, InformationResponse.CONTINUE],
        [101, InformationResponse.SWITCHING_PROTOCOLS],
        [102, InformationResponse.PROCESSING],
        [103, InformationResponse.EARLY_HINTS],
        [200, SuccessfulResponse.OK],
        [201, SuccessfulResponse.CREATED],
        [202, SuccessfulResponse.ACCEPTED],
        [203, SuccessfulResponse.NON_AUTHORITATIVE_INFORMATION],
        [204, SuccessfulResponse.NO_CONTENT],
        [205, SuccessfulResponse.RESET_CONTENT],
        [206, SuccessfulResponse.PARTIAL_CONTENT],
        [207, SuccessfulResponse.MULTI_STATUS],
        [208, SuccessfulResponse.ALREADY_REPORTED],
        [226, SuccessfulResponse.IM_USED],
        [300, RedirectionMessage.MULTIPLE_CHOICES],
        [301, RedirectionMessage.MOVED_PERMANENTLY],
        [302, RedirectionMessage.FOUND],
        [303, RedirectionMessage.SEE_OTHER],
        [304, RedirectionMessage.NOT_MODIFIED],
        [305, RedirectionMessage.USE_PROXY],
        [306, RedirectionMessage.UNUSED],
        [307, RedirectionMessage.TEMPORARY_REDIRECT],
        [308, RedirectionMessage.PERMANENT_REDIRECT],
        [400, ClientErrorResponse.BAD_REQUEST],
        [401, ClientErrorResponse.UNAUTHORIZED],
        [402, ClientErrorResponse.PAYMENT_REQUIRED],
        [403, ClientErrorResponse.FORBIDDEN],
        [404, ClientErrorResponse.NOT_FOUND],
        [405, ClientErrorResponse.METHOD_NOT_ALLOWED],
        [406, ClientErrorResponse.NOT_ACCEPTABLE],
        [407, ClientErrorResponse.PROXY_AUTHENTICATION_REQUIRED],
        [408, ClientErrorResponse.REQUEST_TIMEOUT],
        [409, ClientErrorResponse.CONFLICT],
        [410, ClientErrorResponse.GONE],
        [411, ClientErrorResponse.LENGTH_REQUIRED],
        [412, ClientErrorResponse.PRECONDITION_FAILED],
        [413, ClientErrorResponse.PAYLOAD_TOO_LARGE],
        [414, ClientErrorResponse.URI_TOO_LONG],
        [415, ClientErrorResponse.UNSUPPORTED_MEDIA_TYPE],
        [416, ClientErrorResponse.RANGE_NOT_SATISFIABLE],
        [417, ClientErrorResponse.EXPECTATION_FAILED],
        [418, ClientErrorResponse.IM_A_TEAPOT],
        [421, ClientErrorResponse.MISDIRECTED_REQUEST],
        [422, ClientErrorResponse.UNPROCESSABLE_CONTENT],
        [423, ClientErrorResponse.LOCKED],
        [424, ClientErrorResponse.FAILED_DEPENDENCY],
        [425, ClientErrorResponse.TOO_EARLY],
        [426, ClientErrorResponse.UPGRADE_REQUIRED],
        [428, ClientErrorResponse.PRECONDITION_REQUIRED],
        [429, ClientErrorResponse.TOO_MANY_REQUESTS],
        [431, ClientErrorResponse.REQUEST_HEADER_FIELDS_TOO_LARGE],
        [451, ClientErrorResponse.UNAVAILABLE_FOR_LEGAL_REASONS],
        [500, ServerErrorResponse.INTERNAL_SERVER_ERROR],
        [501, ServerErrorResponse.NOT_IMPLEMENTED],
        [502, ServerErrorResponse.BAD_GATEWAY],
        [503, ServerErrorResponse.SERVICE_UNAVAILABLE],
        [504, ServerErrorResponse.GATEWAY_TIMEOUT],
        [505, ServerErrorResponse.HTTP_VERSION_NOT_SUPPORTED],
        [506, ServerErrorResponse.VARIANT_ALSO_NEGOTIATES],
        [507, ServerErrorResponse.INSUFFICIENT_STORAGE],
        [508, ServerErrorResponse.LOOP_DETECTED],
        [510, ServerErrorResponse.NOT_EXTENDED],
        [511, ServerErrorResponse.NETWORK_AUTHENTICATION_REQUIRED]
    ]);
    static getCategory(code) {
        return this.category_map.get(code);
    }
    static fromCode(code) {
        const http_status = this.status_code_object_map.get(code);
        if (http_status === undefined) {
            throw new Error('狀態碼數值錯誤');
        }
        return http_status;
    }
}
exports.HttpStatusCode = HttpStatusCode;
class HttpError extends Error {
    _status_code;
    static http_error_name_map = new Map([
        [400, 'Bad Request'],
        [401, 'Unauthorized'],
        [402, 'Payment Required'],
        [403, 'Forbidden'],
        [404, 'Not Found'],
        [405, 'Method Not Allowed'],
        [406, 'Not Acceptable'],
        [407, 'Proxy Authentication Required'],
        [408, 'Request Timeout'],
        [409, 'Conflict'],
        [410, 'Gone'],
        [411, 'Length Required'],
        [412, 'Precondition Failed'],
        [413, 'Payload Too Large'],
        [414, 'URI Too Long'],
        [415, 'Unsupported Media Type'],
        [416, 'Range Not Satisfiable'],
        [417, 'Expectation Failed'],
        [418, 'I\'m a teapot'],
        [421, 'Misdirected Request'],
        [422, 'Unprocessable Content'],
        [423, 'Locked'],
        [424, 'Failed Dependency'],
        [425, 'Too Early'],
        [426, 'Upgrade Required'],
        [428, 'Precondition Required'],
        [429, 'Too Many Requests'],
        [431, 'Request Header Fields Too Large'],
        [451, 'Unavailable For Legal Reasons'],
        [500, 'Internal Server Error'],
        [501, 'Not Implemented'],
        [502, 'Bad Gateway'],
        [503, 'Service Unavailable'],
        [504, 'Gateway Timeout'],
        [505, 'HTTP Version Not Supported'],
        [506, 'Variant Also Negotiates'],
        [507, 'Insufficient Storage'],
        [508, 'Loop Detected'],
        [510, 'Not Extended'],
        [511, 'Network Authentication Required']
    ]);
    static getErrorName(status_code) {
        return HttpError.http_error_name_map.get(status_code);
    }
    constructor(code, message = '') {
        super(message);
        const category = HttpStatusCode.getCategory(code);
        if (category === ClientErrorResponse || category === ServerErrorResponse) {
            this._status_code = HttpStatusCode.fromCode(code);
            const http_error_name = HttpError.http_error_name_map.get(code);
            if (http_error_name === undefined) {
                throw new Error('狀態碼數值錯誤');
            }
            else {
                this.name = http_error_name;
            }
        }
        else {
            throw new Error('狀態碼數值錯誤');
        }
    }
    get status_code() {
        return this._status_code;
    }
}
exports.HttpError = HttpError;
