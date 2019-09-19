#ifndef __BASE_64_H__
#define __BASE_64_H__

#include <string>
    
namespace minacoin::util::base64 {
    static const std::string base64_chars = 
             "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
             "abcdefghijklmnopqrstuvwxyz"
             "0123456789+/";
             
    std::string base64_encode(unsigned char const* bytes_to_encode, unsigned int in_len);

    std::string base64_decode(std::string const& encoded_string);

    std::string string_compress_encode(const std::string &data);
}

#endif 