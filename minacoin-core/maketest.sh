
cmake . -DBUILD_TESTS:BOOL=true -DBUILD_MAIN:BOOL=false
make 
./minacoin-core-test
